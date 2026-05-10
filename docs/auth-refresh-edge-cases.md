# Access/Refresh 토큰 엣지케이스 정리

이 문서는 로그인 유지 로직의 토큰 상태별 동작을 정리합니다.  
현재 기준 인증 제어는 middleware 선리다이렉트가 아닌 **클라이언트 재발급/인터셉터 중심**입니다.

## 1. 현재 인증 판단 경계

- 서버 진입(Next middleware): 인증 선리다이렉트 없음 (robots/probe 차단만 수행)
- 앱 초기화(`ReissueProvider`): `/auth/reissue` 1회 시도
- 클라이언트 API 요청(axios interceptor): `accessToken` 유효성 확인 + 필요 시 재발급
- 멘토 진입 페이지: 렌더 전 access 유효성 확인 후 필요 시 재발급
- 채팅 소켓 연결: access 유효성 확인 후 연결

## 2. 토큰 상태별 케이스 매트릭스

| 케이스 | 토큰 상태 | 주로 발생 화면 | 기대 동작 | 현재 처리 |
| --- | --- | --- | --- | --- |
| A | refresh 없음, access 없음 | `/mentor`, `/community`, `/my` 직접 진입 | 인증 필요 화면은 로그인 이동, 공개 화면은 접근 허용 | 클라이언트 재발급 실패/요청 실패 시 로그인 이동 |
| B | refresh 만료/손상, access 없음 | `/mentor`, `/community` 새로고침 | 재발급 실패 후 로그인 이동 | `refreshStatus=failed` + 인터셉터/페이지 리다이렉트 |
| C | refresh 유효, access 없음 | 멘토 첫 진입, 커뮤니티 인증 액션 직전 | 백그라운드 재발급 후 계속 진행 | interceptor/멘토 클라에서 재발급 |
| D | refresh 유효, access 만료 | 멘토 목록/채팅, 커뮤니티 작성/수정 | 만료 access 폐기 -> 재발급 -> 요청 진행 | 만료 access 선제 정리 + 재발급 |
| E | refresh 유효, access 유효하지만 서버에서 401(폐기/불일치) | 멘토 API, 커뮤니티 mutation | 재발급 1회 후 원요청 재시도 | response interceptor에서 1회 retry |
| F | refresh 유효, access 없음 + 동시 다중 요청 | 멘토 페이지 초기 렌더 | 재발급 요청 1회만 수행 | `reissuePromise` 락으로 중복 방지 |
| G | refresh 재발급 실패 | 멘토/커뮤니티 보호 요청 | 무한 재시도 금지 + 로그인 이동 | `refreshStatus=failed`로 차단 후 리다이렉트 |
| H | 멘토 채팅 소켓 연결 시 access 만료 | `/mentor/chat/*` | 만료 토큰으로 연결 시도 금지 | 소켓 훅에서 만료 access 차단 |

## 3. 멘토/커뮤니티에서 자주 터지는 이유

1. 멘토는 초기 렌더 시 인증 의존 API가 많아, access 만료 시 체감 문제가 빠르게 발생
2. 커뮤니티는 목록 조회는 public이지만 작성/수정/댓글은 인증 API라 클릭 시점에 문제 노출
3. 인터셉터/페이지 가드가 동시에 개입하는 구간에서 상태 전이 타이밍 이슈가 발생하기 쉬움

## 4. 현재 보완 포인트

- axios request interceptor에서 **만료된 access 즉시 폐기** 후 재발급 경로 전환
- axios response interceptor에서 401 시 **재발급 1회 후 원요청 재시도**
- 멘토 클라이언트 렌더 분기에서 **만료 access를 유효 토큰으로 취급하지 않도록 보정**
- 소켓 연결 훅에서 **만료 access로 연결 시도 금지**

## 5. 수동 검증 체크리스트

1. refresh 없음 상태에서 `/mentor` 진입 시 middleware 즉시 리다이렉트 없이, 클라이언트 인증 처리 후 로그인 이동
2. refresh 없음 상태에서 `/my` 진입 후 인증 API 호출 시 로그인 이동
3. `/community` 진입은 유지되고, 인증 필요한 액션에서만 로그인 이동
4. refresh 유효 + access 없음 상태에서 `/mentor` 진입 시 재발급 후 정상 렌더
5. refresh 유효 + access 만료 상태에서 커뮤니티 작성/댓글 시도 시 재발급 후 정상 요청
6. access가 서버에서 무효 처리된 상태(401)에서 요청 시 1회 재시도 후 실패 시 로그인 이동

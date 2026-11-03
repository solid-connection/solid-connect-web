# 웹 브라우저 테스트

웹 앱은 세 단계로 검증합니다. Vitest는 상태와 API 처리 로직을 빠르게 확인합니다. Playwright는 실제 Chromium 브라우저에서 화면 이동과 메시지 전송을 확인합니다. Storybook은 컴포넌트를 독립적으로 보여주는 개발 도구입니다. 상태별 화면을 스토리로 남기고 버튼 클릭 같은 상호작용도 브라우저에서 검사합니다.

## 실행

저장소 루트에서 Node.js 22와 pnpm 9를 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm --filter @solid-connect/web exec playwright install chromium
pnpm --filter @solid-connect/web run ci:check
pnpm --filter @solid-connect/web run test:e2e
pnpm --filter @solid-connect/web run test:stories
pnpm --filter @solid-connect/web run build:storybook
```

Linux에서 브라우저 실행에 필요한 운영체제 라이브러리까지 설치하려면 `playwright install --with-deps chromium`을 사용합니다.

E2E는 사용자의 화면 진입부터 결과 확인까지 연결해서 검사하는 테스트입니다. `test:e2e`는 테스트 API 서버를 43180 포트에 띄우고 웹 앱을 43181 포트에 띄우고 대학 카탈로그를 43182 포트에 띄웁니다. 세 포트는 비어 있어야 합니다. 기존 개발 서버를 재사용하지 않으므로 사용자가 열어둔 앱의 데이터나 환경 설정을 바꾸지 않습니다. 테스트가 끝나면 서버도 종료합니다.

```sh
# 한 화면 크기만 검사
pnpm --filter @solid-connect/web run test:e2e --project=desktop
pnpm --filter @solid-connect/web run test:e2e --project=mobile
pnpm --filter @solid-connect/web run test:e2e --project=responsive

# 테스트를 선택해서 실행하고 실패 지점을 확인
pnpm --filter @solid-connect/web run test:e2e:ui
pnpm --filter @solid-connect/web exec playwright show-report

# 컴포넌트 상태와 문서 보기
pnpm --filter @solid-connect/web run storybook
```

Storybook 주소는 `http://localhost:6006`입니다. 빌드 결과는 `apps/web/storybook-static`에 생성됩니다.

## E2E 범위

총 50개 시나리오를 실행합니다. 공통 시나리오는 데스크톱 Chromium과 390 × 844 모바일 Chromium에서 실행합니다. 모바일은 화면 크기와 터치 환경을 재현하며 실제 휴대전화나 Safari 및 앱 내 WebView 검증을 대신하지 않습니다.

| 화면 | 확인하는 흐름 |
| --- | --- |
| 홈 | 파견 학교 검색 링크와 준비 중인 기능 안내 |
| 로그인 | 잘못된 비밀번호 안내 후 입력 수정과 로그인 성공 |
| 마이페이지 | 로그인한 사용자의 프로필 확인과 로그아웃 후 채팅 접근 제한 |
| 멘토 | 비회원 진입 시 로그인 화면 안내 |
| 커뮤니티 | 게시글 목록 표시와 글쓰기 진입 및 로그인 후 작성 화면 복귀 |
| 성적 | 등록 내역이 없는 상태와 공인어학 및 학점 탭 전환과 입력 화면 진입 |
| 지원자 현황 | 비회원 제한 화면과 로그인 이동 |
| 약관 및 잘못된 경로 | 약관 표시와 유효하지 않은 채팅방의 오류 화면 |
| 채팅 전송 | REST 기록과 실시간 메시지 통합 및 한 번 전송과 새로고침 후 유지 |
| 채팅 기록 | 이전 기록 추가 시 읽던 위치 유지와 조회 실패 후 재시도 |
| 채팅 연결 | 연결 중단 중 초안 유지와 재연결 후 45개 메시지의 누락 없는 복구 |
| 채팅 이미지 | 업로드 실패 후 선택 이미지와 텍스트 유지 및 재시도 |
| 채팅 접근 | 목록 조회 실패 복구와 방 이동 시 기록 분리 및 권한 상실 시 기록 숨김과 전송 차단 |
| 채팅 인증 | 토큰 갱신의 일시 장애에서 초안과 선택 이미지 보존 및 재연결과 만료 후 첫 진입의 갱신 재시도 및 과거 기록을 읽는 중 만료 후 수신과 전송 |
| 채팅 확인 | 기록 조회보다 늦은 소켓 응답과 중복 응답을 한 번만 처리 |
| 반응형 | 홈과 로그인 및 마이페이지와 대학 목록 및 채팅의 화면 크기 전환과 상태 보존 |
| 채팅 모바일 | 작성 영역이 화면과 하단 탐색 메뉴 안쪽에 배치되는지 확인 |

반응형 전용 시나리오는 390px부터 1536px까지 일곱 너비를 검사합니다. 767px와 768px 경계에서 메뉴가 전환되는지와 학교 검색 조건 및 로그인 입력과 채팅 초안이 유지되는지를 확인합니다. 긴 학교명과 카드 너비 및 가로 넘침도 검사합니다. 대학 카탈로그는 `apps/university-web`이 별도로 배포하는 화면입니다. 테스트에서도 별도 서버로 실행해 웹 앱의 경로 연결과 목록 검색 및 빈 결과 복구를 함께 확인합니다. 관리 앱은 이 E2E 범위에 포함하지 않습니다. 성적 제출과 지원 완료 및 커뮤니티 작성 저장도 별도 시나리오가 필요합니다.

## 테스트 서버

`apps/web/e2e/fixtures/server.mjs`는 테스트가 사용할 응답과 상태를 가진 로컬 서버입니다. REST는 기록 조회와 업로드를 처리하는 HTTP API입니다. SockJS와 STOMP는 실제 채팅 연결에서 사용하는 통신 방식입니다. 테스트 서버가 이 방식을 받아주므로 앱의 실제 연결 코드를 그대로 거칩니다.

매 테스트가 새 브라우저 환경과 초기화한 서버 상태로 시작합니다. 하나의 서버를 공유하므로 `workers: 1`로 순차 실행합니다. 병렬 실행하려면 먼저 작업자별 서버나 데이터 공간을 분리해야 합니다. 브라우저의 외부 요청을 차단하며 API 주소는 Next.js 기동 전에 로컬 주소로 고정합니다. 구현하지 않은 API가 호출되면 테스트 종료 시 실패합니다.

`/__control`은 연결 중단과 업로드 실패 및 기록 조회 실패 같은 상황을 만드는 테스트 전용 경로입니다. 운영 앱에는 등록하지 않습니다. 테스트 로그인과 토큰도 이 서버에서만 사용합니다.

이 검증은 프론트엔드가 약속된 API 응답에 맞게 동작한다는 의미입니다. 운영 서버에서 두 사용자가 주고받는 메시지의 저장과 실제 전달 및 읽음 반영은 별도의 통합 검증이 필요합니다.

## Storybook 범위

| 컴포넌트 | 스토리 |
| --- | --- |
| 공통 버튼 | 기본 버튼과 보조 버튼 및 비활성 상태 |
| 공통 입력 | 기본 입력과 회색 입력 및 비활성 상태 |
| 빈 카드 | 기본 안내와 검색 결과 없음 |
| 프로필 | 멘티와 멘토 및 채팅용 작은 크기 |
| 탭 | 상태를 바꾸는 탭 선택 |
| 성적 카드 | 승인 완료와 심사 중 및 승인 거절과 학점 |
| 채팅 입력 | 전송 성공과 연결 끊김 및 접근 제한과 전송 실패 및 이미지 선택과 업로드 실패 및 전송 중 |
| 채팅 메시지 | 수신과 발신 및 긴 텍스트와 이미지 및 파일 |
| 데스크톱 홈 | 비회원과 회원 및 빈 목록과 긴 학교명 및 좁은 본문과 이미지 실패 |

`test:stories`는 34개 스토리를 Chromium에서 렌더링합니다. 버튼 클릭과 입력 및 탭 전환과 메시지 전송과 실패 후 초안 유지도 검사합니다. `fn()`으로 만든 함수가 실제 호출됐는지 확인하므로 렌더링만 성공하는 테스트와 구분합니다. 이미지나 파일 스토리는 상태를 보여주는 예시이며 실제 파일 다운로드 성공을 보장하지 않습니다.

새 스토리는 컴포넌트 옆의 `*.stories.tsx`에 작성합니다. Next.js 경로 기능과 Tailwind 스타일을 공통 설정으로 사용합니다. Storybook 전용 Next.js 설정을 사용하므로 배포용 도메인이나 Sentry 인증 정보가 없어도 실행할 수 있습니다. 앱에서 SVG를 React 컴포넌트로 불러오므로 Storybook도 같은 방식으로 처리합니다.

## CI

GitHub Actions는 웹 앱이나 공유 패키지 또는 루트 설정이 바뀌면 다음 작업을 실행합니다.

| 작업 | 실행 내용 |
| --- | --- |
| Web - Quality Check | 기존 `ci:check`로 정적 검사와 타입 검사 및 채팅 회귀 테스트 |
| Web - Build | 기존 Next.js 프로덕션 빌드 |
| Web - E2E (desktop) | 로컬 테스트 서버와 개발 서버를 통한 데스크톱 흐름 |
| Web - E2E (mobile) | 별도의 실행 환경에서 모바일 흐름 |
| Web - E2E (responsive) | 일곱 화면 너비의 배치와 상태 보존 |
| Web - Storybook | 스토리 정적 빌드와 Chromium 렌더링 및 상호작용 검사 |

E2E와 Storybook은 빠른 품질 검사 뒤에 별도 작업으로 실행합니다. 대학 카탈로그만 바뀌어도 E2E는 실행됩니다. E2E 개발 서버 검증과 Next.js 프로덕션 빌드 검증은 서로 다른 단계입니다. 브라우저 테스트는 Husky 커밋 훅에 추가하지 않습니다.

E2E 보고서는 성공 시에도 7일 동안 보관합니다. 실패하면 스크린샷과 비디오 및 trace도 포함합니다. trace는 요청과 화면 변화를 시간 순서로 살펴볼 수 있는 기록입니다. Storybook 빌드와 실패 화면도 7일 동안 보관합니다. 생성된 결과물은 Git에 포함하지 않습니다.

설정 방식은 [Playwright 서버 실행 문서](https://playwright.dev/docs/test-webserver)와 [Storybook Next.js 안내](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite) 및 [Vitest 연동 안내](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)를 따릅니다.

# Skill: Bruno API 동기화 + Codegen + React Query 연계

## 목적

- Bruno 명세를 최신으로 동기화하고, `bruno-api-typescript` 생성물을 안정적으로 갱신한다.
- 생성 코드와 앱 레이어(React Query)를 분리해 유지보수성과 변경 대응력을 높인다.

## 적용 범위

- API 스키마/클라이언트 생성 관련 작업
- 응답 타입 불일치 점검
- 앱별 React Query 래퍼/훅 연결

## 실행 트리거 예시

- "브루노 다시 동기화해줘"
- "codegen 돌려서 타입 최신화해줘"
- "생성 코드 기준으로 react-query 붙여줘"
- "응답 타입이 서버랑 다른데 원인 확인해줘"

## 핵심 원칙

1. Bruno를 단일 소스로 본다.
2. 생성 파일을 직접 수정하지 않는다.
3. 잘못된 생성 결과는 생성기(`packages/bruno-api-typescript`)를 수정한다.
4. `onSuccess`, invalidation, toast, navigation 등은 앱 레이어에서 처리한다.

## 표준 절차

1. Bruno 동기화
   - `pnpm --filter @solid-connect/api-schema run sync:bruno`
   - 필요 시: `BRUNO_FORCE=true pnpm --filter @solid-connect/api-schema run sync:bruno:remote`
2. 생성물 확인
   - 변경 파일: `packages/api-schema/src/apis/*`
3. 타입 검증
   - `pnpm --filter @solid-connect/api-schema run verify:schema`
4. 앱 레이어 연결(필요 시)
   - `apps/web/src/apis/*`, `apps/admin/src/*`에서 React Query 훅/래퍼 구성
5. 앱 검증
   - 웹: `pnpm --filter @solid-connect/web run typecheck`
   - 어드민: 프로젝트 규칙에 맞는 검증 실행

## 응답 타입 불일치 대응

1. Bruno 원본 `.bru`의 `docs` 응답 예시를 확인한다.
2. 생성된 타입(`packages/api-schema/src/apis/<domain>/api.ts`)과 비교한다.
3. 불일치 원인을 분류한다.
   - docs 예시 부족/모호
   - 생성기 추론 한계
4. 생성기 수정 후 재생성/재검증한다.

## React Query 연계 규칙

- 생성 코드(`api.ts`)는 순수 axios 호출만 담당한다.
- React Query 훅은 앱에서 작성한다.
  - query key 정책
  - optimistic update
  - invalidate strategy
  - 성공/실패 부수효과

## PR 작성 규칙

1. 생성기 수정과 생성물 변경을 구분해 설명한다.
2. 검증 명령과 결과를 본문에 명시한다.
3. 응답 스키마 이슈가 있었다면 Bruno 근거와 해결 방식을 첨부한다.

## 실패 대응

- remote sync 실패 시:
  - `BRUNO_REPO_URL`, `BRUNO_REPO_REF`, `BRUNO_COLLECTION_PATH` 점검
- 생성 실패 시:
  - 파싱 불가 `.bru`와 docs JSON 형식 확인
- 타입 불일치 지속 시:
  - 임시 수동 패치 금지, 생성기 로직 우선 수정

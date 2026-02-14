# Skill: feat/univ-extends 리베이스 + Bruno 명세 동기화

## 목적

- `feat/univ-extends`를 최신 기준 브랜치에 리베이스한다.
- Bruno 명세 변경이 생겨도 TypeScript API 코드를 재생성할 수 있는 구조를 유지한다.

## 리베이스 절차

1. 기준 브랜치 fetch
   - `git fetch --all --prune`
2. 기준 브랜치 확인
   - `develop`이 없으면 로컬 `develop`을 최신 `origin/main`으로 맞춘 뒤 사용
3. 리베이스 실행
   - `git rebase develop`
4. 충돌 처리 원칙
   - 자동 생성 API 충돌은 의미 없는 대량 충돌이면 해당 커밋 `git rebase --skip`
   - 기능 코드 충돌은 수동 병합 후 `git add` + `git rebase --continue`

## Bruno 동기화 절차

1. 기본 실행
   - `pnpm run sync:bruno`
2. 원격 명세 강제 동기화
   - `BRUNO_REPO_URL=<repo-url> pnpm --filter @solid-connect/api-schema run sync:bruno:remote`
3. 모드 제어
   - `BRUNO_SOURCE_MODE=local|remote|auto`

## 환경 변수 규칙

- `BRUNO_COLLECTION_DIR`: 로컬 명세 폴더를 직접 지정
- `BRUNO_REPO_URL`: 원격 Bruno 저장소 URL
- `BRUNO_REPO_REF`: 원격 브랜치/태그 (기본 `main`)
- `BRUNO_COLLECTION_PATH`: 저장소 내부 명세 폴더 (기본 `Solid Connection`)

## 검증 체크리스트

1. `pnpm --filter @solid-connect/api-schema run sync:bruno`
2. `pnpm typecheck`
3. `pnpm build`

## 실패 대응

- 로컬 명세 폴더 미존재 + `BRUNO_REPO_URL` 미설정이면 즉시 실패한다.
- 원격 clone 성공 후 `BRUNO_COLLECTION_PATH` 경로가 없으면 즉시 실패한다.

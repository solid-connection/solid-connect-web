---
name: univ-extends-bruno-sync
description: Rebase the feat/univ-extends branch and keep the generated Bruno TypeScript API client in sync. Use only when working on the feat/univ-extends branch or asked to rebase it against develop/main.
---

# feat/univ-extends 리베이스 + Bruno 명세 동기화

## 목적

- `feat/univ-extends`를 최신 기준 브랜치에 리베이스한다.
- Bruno 명세 변경이 생겨도 TypeScript API 코드를 재생성할 수 있는 구조를 유지한다.

## 리베이스 절차

1. 기준 브랜치 fetch
   - `git fetch --all --prune`
2. 기준 브랜치 확인
   - `git ls-remote --heads origin develop`으로 원격 `develop` 존재 여부를 먼저 확인한다.
   - 존재하면: 로컬 `develop`을 최신 `origin/develop`으로 맞춘 뒤(`git checkout develop && git reset --hard origin/develop`, 로컬에 없으면 `git checkout -b develop origin/develop`) 그 브랜치로 리베이스한다.
   - 존재하지 않으면(이 저장소는 기본적으로 `develop`이 없다): `origin/main`을 기준으로 직접 리베이스한다. 로컬 `develop`을 만들어서 우회하지 않는다.
3. 리베이스 실행
   - `origin/develop`이 있는 경우: `git rebase develop`
   - 없는 경우: `git rebase origin/main`
4. 충돌 처리 원칙
   - 자동 생성 API 충돌은 의미 없는 대량 충돌이면 해당 커밋 `git rebase --skip`
   - 기능 코드 충돌은 수동 병합 후 `git add` + `git rebase --continue`

## Bruno 동기화 절차

1. 기본 실행
   - `pnpm run sync:bruno`
2. 원격 명세 강제 동기화 (기본과 동일 동작 명시)
   - `pnpm --filter @solid-connect/api-schema run sync:bruno:remote`
3. 모드 제어
   - `BRUNO_SOURCE_MODE=local|remote|auto` (기본: `remote`)

## 환경 변수 규칙

- `BRUNO_COLLECTION_DIR`: 로컬 명세 폴더를 직접 지정
- `BRUNO_REPO_URL`: 원격 Bruno 저장소 URL
- `BRUNO_REPO_REF`: 원격 브랜치/태그 (기본 `main`)
- `BRUNO_COLLECTION_PATH`: 저장소 내부 명세 폴더 (기본 `Solid Connection`)
- 권장 파일: `packages/api-schema/.env`

## 검증 체크리스트

1. `pnpm --filter @solid-connect/api-schema run sync:bruno`
2. `pnpm typecheck`
3. `pnpm build`

## 실패 대응

- `BRUNO_COLLECTION_DIR`이 설정되어 있으면 `BRUNO_SOURCE_MODE` 값과 무관하게 그 로컬 경로가 항상 우선 사용된다(`packages/api-schema/scripts/sync-bruno.mjs`의 `resolveCollectionDir()` 참고). 이 경우 `BRUNO_REPO_URL`은 필요 없다.
- `BRUNO_COLLECTION_DIR`이 없고, `BRUNO_SOURCE_MODE=remote`이거나(`auto` 모드에서 로컬 기본 경로도 없어) 원격 경로를 resolve해야 하는 상황에서 `BRUNO_REPO_URL`이 없으면 즉시 실패한다.
- 원격 clone 성공 후 `BRUNO_COLLECTION_PATH` 경로가 없으면 즉시 실패한다.

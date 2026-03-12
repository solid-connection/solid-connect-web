# Skill: Biome 단일 품질체크 표준화 (Web/Admin/CI)

## 목적

- 모노레포 전체를 Biome 기반 품질체크 흐름으로 통일한다.
- 로컬(Husky)과 GitHub Actions의 실행 명령을 동일하게 유지한다.

## 표준 명령

### Web

- 자동 수정: `pnpm --filter @solid-connect/web run lint`
- 체크 전용: `pnpm --filter @solid-connect/web run lint:check`
- 타입 체크: `pnpm --filter @solid-connect/web run typecheck:ci`
- CI 체크: `pnpm --filter @solid-connect/web run ci:check`

### Admin

- 자동 수정: `pnpm --filter @solid-connect/admin run lint`
- 체크 전용: `pnpm --filter @solid-connect/admin run lint:check`
- 타입 체크: `pnpm --filter @solid-connect/admin run typecheck`
- CI 체크: `pnpm --filter @solid-connect/admin run ci:check`

### Root (Turbo)

- 전체 CI 체크: `pnpm ci:check`
- 전체 타입 체크: `pnpm typecheck`
- 전체 빌드: `pnpm build`

## 적용 원칙

1. CI에서는 `--write`를 사용하지 않는다.
2. 수동 포맷/린트 수정은 로컬에서만 실행한다.
3. 신규 패키지 추가 시 `lint`, `lint:check`, `typecheck`, `ci:check` 스크립트를 동일 규칙으로 맞춘다.
4. Husky pre-commit/push와 GitHub Actions가 같은 스크립트를 호출하도록 유지한다.

## 작업 절차

1. package 스크립트 점검
   - `lint`는 자동 수정, `lint:check`는 체크 전용으로 분리
   - `ci:check`는 `lint:check + typecheck` 조합으로 고정
2. CI 워크플로우 점검
   - 앱별 품질 단계에서 `pnpm --filter <app> run ci:check` 사용
3. Husky 훅 점검
   - pre-commit: 변경된 앱의 `ci:check`
   - pre-push: 변경된 앱의 `ci:check` + `build`

## 검증 체크리스트

1. `pnpm --filter @solid-connect/web run ci:check`
2. `pnpm --filter @solid-connect/admin run ci:check`
3. `pnpm ci:check`
4. `pnpm build`

## 실패 대응

- Biome 오류: 각 앱에서 `pnpm --filter <app> run lint` 후 재실행
- 타입 오류: 해당 앱 `typecheck` 로그 기준으로 타입 수정
- CI/로컬 불일치: `.husky/*`와 `.github/workflows/ci.yml`의 실행 명령을 같은 값으로 재정렬

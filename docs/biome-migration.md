# Biome 마이그레이션 가이드

## 개요

ESLint와 Prettier를 Biome으로 통합하여 더 빠르고 일관된 코드 품질 관리 도구로 전환했습니다.

### 마이그레이션 완료 일자
2026년 1월 24일

## Biome이란?

Biome은 JavaScript, TypeScript, JSX, JSON, CSS 등을 위한 빠른 포맷터이자 린터입니다.
- ESLint + Prettier를 단일 도구로 통합
- Rust로 작성되어 매우 빠른 성능 (ESLint보다 최대 25배 빠름)
- 설정이 단순하고 zero-config로도 사용 가능
- 자동 import 정렬 기능 내장

## 변경 사항

### 제거된 패키지
- `eslint`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-config-airbnb`
- `eslint-config-next`
- `eslint-config-prettier`
- `eslint-plugin-prettier`
- `prettier-plugin-tailwindcss`
- `@trivago/prettier-plugin-sort-imports`

### 추가된 패키지
- `@biomejs/biome` (v2.3.11)

### 제거된 파일
- `.eslintrc.js`
- `.prettierrc.json`
- `.prettierignore`
- `.eslintignore`

### 추가된 파일
- `biome.json` - Biome 설정 파일

### 변경된 스크립트

#### 이전 (package.json)
```json
{
  "lint": "next lint --dir src",
  "lint:fix": "next lint --dir src --fix",
  "ci:check": "pnpm run lint && pnpm run typecheck",
  "lint:all": "pnpm run lint && pnpm run format:check && pnpm run typecheck",
  "fix:all": "pnpm run lint:fix && pnpm run format"
}
```

#### 이후 (package.json)
```json
{
  "lint": "biome check --write .",
  "lint:check": "biome check .",
  "format": "biome format --write .",
  "format:check": "biome format .",
  "ci:check": "pnpm run lint:check && pnpm run typecheck",
  "fix:all": "pnpm run lint && pnpm run format"
}
```

## 명령어 사용법

### 개발 중

```bash
# 자동 수정과 함께 lint 실행
pnpm run lint

# lint만 체크 (수정 안함)
pnpm run lint:check

# 포맷팅 적용
pnpm run format

# 포맷팅 체크만 (수정 안함)
pnpm run format:check

# 모든 수정 적용 (lint + format)
pnpm run fix:all
```

### CI/CD

```bash
# CI에서 사용 (lint 체크 + typecheck)
pnpm run ci:check
```

## Biome 설정 (biome.json)

주요 설정 항목:

### 포맷터 설정
- **Line Width**: 120자
- **Indent**: 스페이스 2칸
- **Semicolons**: 항상 사용
- **Quotes**: 더블 쿼트 (JavaScript/TypeScript)
- **JSX Quotes**: 더블 쿼트
- **Trailing Commas**: 모든 곳에 사용 (JSON 제외)
- **Arrow Parentheses**: 항상 사용

### 린터 규칙
- **Recommended**: 활성화 (Biome 권장 규칙)
- **Console/Alert**: 허용 (개발 편의)
- **Explicit Any**: 경고 (TypeScript)
- **Unused Variables**: 경고
- **React Exhaustive Dependencies**: 경고

### CSS 지원
- Tailwind CSS directives 지원
- CSS Modules 지원

### 무시 파일
VCS (Git) ignore 파일 자동 사용

## VS Code 설정

### 필수 확장 프로그램
- **Biome** (`biomejs.biome`) - 설치 권장

### 제거 권장 확장 프로그램
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)

### 자동 설정
`.vscode/settings.json`과 `.vscode/extensions.json`이 자동으로 구성되어 있습니다.

저장 시 자동 포맷팅과 import 정렬이 활성화됩니다.

## CI/CD 변경사항

### GitHub Actions (`.github/workflows/ci.yml`)

```yaml
- name: Run Biome (lint & format) & TypeScript
  run: pnpm run ci:check
```

### Husky Pre-push (`.husky/pre-push`)

```bash
echo "🔍 Running Biome check before push..."
pnpm run lint:check

echo "🔍 Running type check before push..."
pnpm run typecheck
```

## 마이그레이션 통계

### 자동 수정된 파일
- **포맷팅**: 442개 파일
- **Lint 수정**: 275개 파일 (safe fixes)
- **Lint 수정**: 70개 파일 (unsafe fixes)

### 남은 이슈
- **Errors**: 107개 (주로 명시적 any 타입 사용)
- **Warnings**: 53개 (unused variables 등)

이러한 이슈들은 점진적으로 수정 가능하며, 빌드나 런타임에는 영향을 주지 않습니다.

## 장점

### 성능
- ESLint + Prettier 대비 최대 25배 빠른 실행 속도
- 대규모 프로젝트에서도 빠른 응답 시간

### 단순성
- 단일 설정 파일 (`biome.json`)
- 단일 CLI 명령어
- 단일 VS Code 확장 프로그램

### 일관성
- 포맷팅과 린팅의 완벽한 통합
- 설정 충돌 없음

### 개발자 경험
- 즉각적인 피드백
- 명확한 에러 메시지
- 자동 import 정렬 내장

## 문제 해결

### Biome이 파일을 무시하는 경우
`.gitignore` 파일을 확인하세요. Biome은 VCS ignore를 자동으로 사용합니다.

### VS Code에서 포맷팅이 작동하지 않는 경우
1. Biome 확장 프로그램 설치 확인
2. ESLint/Prettier 확장 프로그램 비활성화
3. VS Code 재시작

### CI에서 실패하는 경우
로컬에서 `pnpm run ci:check` 실행하여 동일한 이슈 재현 후 수정

## 참고 자료

- [Biome 공식 문서](https://biomejs.dev/)
- [Biome vs ESLint/Prettier](https://biomejs.dev/guides/getting-started/)
- [Biome VS Code 확장](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

## 이전 문서

기존 ESLint/Prettier 마이그레이션 계획은 [`eslint-prettier-migration-prd.md`](./eslint-prettier-migration-prd.md)를 참조하세요.

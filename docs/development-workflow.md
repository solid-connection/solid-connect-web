# 개발 워크플로우 가이드

이 문서는 solid-connect-web 프로젝트의 개발 워크플로우를 설명합니다.

## 목차

1. [커밋 메시지 규칙](#커밋-메시지-규칙)
2. [Git Hooks](#git-hooks)
3. [스크립트 사용법](#스크립트-사용법)
4. [CI/CD 프로세스](#cicd-프로세스)
5. [일반적인 개발 워크플로우](#일반적인-개발-워크플로우)
6. [문제 해결](#문제-해결)

---

## 커밋 메시지 규칙

### 형식

```
<type>: <subject>

<body> (선택)
```

### 타입 설명

| 타입       | 설명                                               | 예시                                            |
| ---------- | -------------------------------------------------- | ----------------------------------------------- |
| `feat`     | 새로운 기능 추가, 기존 기능을 요구사항에 맞게 수정 | `feat: 로그인 페이지 인풋 필드 디자인 업데이트` |
| `fix`      | 버그 수정                                          | `fix: 린트 에러 수정`                           |
| `refactor` | 기능 변화 없이 코드 리팩터링                       | `refactor: 컴포넌트 구조 개선`                  |
| `style`    | 코드 스타일, 포맷팅 수정                           | `style: 코드 포맷팅 적용`                       |
| `test`     | 테스트 코드 추가/수정                              | `test: 로그인 유닛 테스트 추가`                 |
| `docs`     | 문서(주석) 수정                                    | `docs: README 업데이트`                         |
| `chore`    | 패키지 매니저 수정, 기타 수정                      | `chore: 의존성 업데이트`                        |

### 올바른 예시

```bash
feat: 로그인 페이지 인풋 필드 디자인 업데이트

- border 색상을 border-k-100으로 명시
- 고정 높이 제거하여 padding과 line-height로 자동 계산
```

```bash
fix: 린트 에러 수정

- any 타입을 unknown으로 변경
- 중복된 className prop 제거
```

```bash
chore: 사용하지 않는 패키지 제거
```

### 잘못된 예시

```bash
update login page        # ❌ 타입 없음
feat login               # ❌ 콜론 없음
FEAT: Login page update  # ❌ 대문자 타입
feat : 로그인 업데이트    # ❌ 콜론 앞에 공백
```

---

## Git Hooks

프로젝트는 [Husky](https://typicode.github.io/husky/)를 사용하여 Git hooks를 관리합니다.

### 설치된 Hooks

#### commit-msg

커밋 메시지를 [commitlint](https://commitlint.js.org/)로 검증합니다.

- 규칙에 맞지 않는 커밋 메시지는 **자동으로 차단**됩니다.
- 올바른 형식: `<type>: <subject>`

#### pre-commit

- 커밋 전 GitHub CI 품질 검사와 동일한 체크를 실행합니다.
- 실행 명령:
  - `pnpm --filter @solid-connect/web run ci:check`
  - `pnpm --filter @solid-connect/admin run lint`
  - `pnpm --filter @solid-connect/admin run format`

#### pre-push

- 푸시 전 GitHub CI 빌드 단계와 동일한 빌드를 실행합니다.
- 실행 명령:
  - `pnpm --filter @solid-connect/web run build`
  - `pnpm --filter @solid-connect/admin run build`

### Hooks가 동작하지 않는 경우

```bash
# Husky 재설치
npm run prepare

# 실행 권한 부여 (macOS/Linux)
chmod +x .husky/commit-msg
chmod +x .husky/pre-commit
```

---

## 스크립트 사용법

### 개발

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행
```

### 린트

```bash
npm run lint         # ESLint 실행
npm run lint:fix     # ESLint 자동 수정
```

### 포맷팅

```bash
npm run format       # Prettier로 코드 포맷팅
npm run format:check # Prettier 포맷팅 체크 (CI용)
```

### 타입 체크

```bash
npm run typecheck    # TypeScript 타입 체크
```

### 통합 명령어

```bash
npm run lint:all     # lint + format:check + typecheck
npm run fix:all      # lint:fix + format (자동 수정)
```

### 추천 워크플로우

코드 수정 후 커밋 전에:

```bash
npm run fix:all      # 모든 자동 수정 적용
```

---

## CI/CD 프로세스

### 트리거

- `main` 브랜치로 push
- `develop` 브랜치로 push
- `main` 또는 `develop` 브랜치로 PR 생성

### Jobs

#### 1. Lint & Type Check

- ESLint 실행
- Prettier 포맷팅 체크
- TypeScript 타입 체크

#### 2. Build

- Next.js 프로덕션 빌드

#### 3. PR Title Validation (PR만)

- PR 제목이 커밋 메시지 규칙을 준수하는지 검증

### CI 실패 대응

1. **ESLint 실패**: `npm run lint:fix`로 자동 수정
2. **Prettier 실패**: `npm run format`으로 자동 수정
3. **타입 체크 실패**: TypeScript 오류 직접 수정
4. **빌드 실패**: 빌드 로그 확인 후 오류 수정

---

## 일반적인 개발 워크플로우

### 1. 기능 개발

```bash
# 1. 개발 브랜치 생성
git checkout -b feat/new-feature

# 2. 개발 서버 실행
npm run dev

# 3. 코드 작성...
```

### 2. 커밋 전 검증

```bash
# 자동 수정 및 검증
npm run fix:all

# 또는 개별 실행
npm run lint:fix
npm run format
npm run typecheck
```

### 3. 커밋

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
# commitlint가 자동으로 메시지 검증
```

### 4. 푸시 및 PR

```bash
git push origin feat/new-feature
# GitHub에서 PR 생성
# CI가 자동으로 실행
```

---

## 문제 해결

### 커밋 메시지 검증 실패

**문제**: 커밋 메시지가 규칙에 맞지 않아 커밋 실패

**해결**:

1. 커밋 메시지 형식 확인: `<type>: <subject>`
2. 허용된 타입 확인: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`
3. 올바른 형식으로 다시 커밋

### 커밋 메시지 수정

```bash
# 가장 최근 커밋 메시지 수정
git commit --amend -m "fix: 올바른 커밋 메시지"

# 이미 푸시한 경우 (주의: force push)
git push --force-with-lease origin branch-name
```

### CI 실패

**문제**: CI에서 린트, 포맷팅, 또는 빌드 실패

**해결**:

```bash
# 1. 로컬에서 동일한 검증 실행
npm run lint:all

# 2. 자동 수정 시도
npm run fix:all

# 3. 빌드 테스트
npm run build

# 4. 수정 후 다시 푸시
git add .
git commit -m "fix: CI 오류 수정"
git push
```

### Git hooks가 동작하지 않음

**문제**: 커밋 시 commitlint가 실행되지 않음

**해결**:

```bash
# 1. Husky 재설치
npm run prepare

# 2. .husky/commit-msg 파일 확인
cat .husky/commit-msg

# 3. 실행 권한 확인 (macOS/Linux)
chmod +x .husky/commit-msg
```

### node_modules 문제

**문제**: 의존성 관련 오류 발생

**해결**:

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
```

---

## 참고 자료

- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)

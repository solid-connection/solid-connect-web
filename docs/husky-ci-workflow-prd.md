# Husky & CI 워크플로우 완성 PRD

## 1. 개요

### 1.1 목적

Git hooks(Husky)와 CI/CD 파이프라인을 완성하여 코드 품질을 자동으로 검증하고, 일관된 커밋 메시지 형식을 보장하며, 안정적인 배포 프로세스를 구축합니다.

### 1.2 배경

- 현재 Husky와 commitlint가 기본적으로 설정되어 있으나 최적화 필요
- CI 워크플로우가 기본적으로 구성되어 있으나 개선 여지 존재
- 개발 워크플로우 전반에 걸친 자동화 부족
- 코드 품질 검증 프로세스의 일관성 부족

### 1.3 범위

- Git Hooks (Husky) 설정 완성
- Commitlint 커밋 메시지 검증 강화
- CI/CD 파이프라인 최적화
- 개발자 워크플로우 문서화

## 2. 현재 상황 분석

### 2.1 현재 설정 상태

#### Husky

- ✅ 설치 및 초기화 완료 (`husky@9.1.7`)
- ✅ `prepare` 스크립트 설정됨
- ✅ `.husky/commit-msg` 훅 존재 (commitlint 실행)
- ✅ `.husky/pre-commit` 훅 존재 (현재 주석만 있음)

#### Commitlint

- ✅ 설치 완료 (`@commitlint/cli@20.2.0`, `@commitlint/config-conventional@20.2.0`)
- ✅ `commitlint.config.js` 설정 파일 존재
- ✅ 커밋 메시지 타입 제한: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`

#### CI/CD

- ✅ `.github/workflows/ci.yml` 존재
- ✅ `lint`와 `build` job이 병렬 실행
- ✅ Node.js 22.x 사용
- ✅ npm 캐싱 적용

### 2.2 문제점 및 개선 사항

1. **Git Hooks**
   - `pre-commit` 훅이 비어있음 (활용 가능)
   - `pre-push` 훅이 없음 (선택적 추가 가능)

2. **CI/CD**
   - Prettier 포맷팅 체크 없음
   - 커밋 메시지 검증이 CI에서 수행되지 않음
   - 테스트 단계 없음 (향후 확장 가능)

3. **문서화**
   - 개발 워크플로우 가이드 부족
   - 커밋 메시지 규칙 상세 설명 필요

4. **자동화**
   - 자동 수정/포맷팅 명령어 부재
   - 개발 중 실시간 검증 부족

## 3. 목표

### 3.1 주요 목표

1. **Git Hooks 완성**
   - `pre-commit`: 빠른 검증 (선택적)
   - `commit-msg`: 커밋 메시지 검증 (현재 동작 중)
   - `pre-push`: 선택적 검증 (CI와 중복 방지)

2. **CI/CD 파이프라인 강화**
   - 린트, 타입 체크, 빌드 검증
   - Prettier 포맷팅 체크 추가
   - 커밋 메시지 검증 (PR 제목)
   - 병렬 실행으로 성능 최적화

3. **개발자 경험 개선**
   - 명확한 워크플로우 가이드
   - 자동 수정 명령어 제공
   - 빠른 피드백 루프

4. **코드 품질 보장**
   - 일관된 커밋 메시지 형식
   - 자동 코드 품질 검증
   - 배포 전 자동 검증

### 3.2 성공 지표

- 커밋 메시지 규칙 준수율 100%
- CI 실패율 감소 (잘못된 코드 배포 방지)
- 개발자 생산성 향상 (수동 검증 시간 감소)
- 코드 리뷰 시간 단축 (스타일 이슈 감소)

## 4. 요구사항

### 4.1 기능 요구사항

#### FR1: Git Hooks 완성

**FR1.1: pre-commit 훅 (선택적)**

- 빠른 검증 수행 (선택적)
- 현재는 비활성화 상태 유지 가능
- 향후 필요시 활성화 가능하도록 구조화

**FR1.2: commit-msg 훅 (필수)**

- commitlint를 통한 커밋 메시지 검증
- 규칙 위반 시 커밋 차단
- 명확한 에러 메시지 제공

**FR1.3: pre-push 훅 (선택적)**

- CI에서 이미 검증하므로 기본적으로 비활성화
- 필요시 로컬 빌드 체크만 수행 (선택적)

#### FR2: CI/CD 파이프라인 강화

**FR2.1: Lint Job**

- ESLint 실행
- TypeScript 타입 체크
- Prettier 포맷팅 체크 (신규)

**FR2.2: Build Job**

- Next.js 빌드 검증
- 프로덕션 환경 변수 검증

**FR2.3: 커밋 메시지 검증 (PR)**

- PR 제목을 커밋 메시지 규칙으로 검증
- PR 머지 커밋 메시지 검증

**FR2.4: 병렬 실행**

- `lint`와 `build` job 병렬 실행
- 캐싱을 통한 실행 시간 최적화

#### FR3: package.json 스크립트 추가

**FR3.1: 린트 관련**

- `lint`: 린트 체크
- `lint:fix`: 린트 자동 수정

**FR3.2: 포맷팅 관련**

- `format`: Prettier 포맷팅 적용
- `format:check`: Prettier 포맷팅 체크 (CI용)

**FR3.3: 통합 명령어**

- `lint:all`: 린트 + 포맷팅 체크
- `fix:all`: 린트 자동 수정 + 포맷팅 적용

#### FR4: 문서화

**FR4.1: 개발 워크플로우 가이드**

- 커밋 메시지 작성 가이드
- Git hooks 동작 방식 설명
- CI/CD 프로세스 설명

**FR4.2: 문제 해결 가이드**

- 일반적인 오류 및 해결 방법
- 커밋 메시지 수정 방법
- CI 실패 시 대응 방법

### 4.2 비기능 요구사항

#### NFR1: 성능

- Git hooks 실행 시간: 3초 이내
- CI 실행 시간: 10분 이내 (병렬 실행)
- 개발자 워크플로우 방해 최소화

#### NFR2: 호환성

- Node.js 22.x 호환
- Next.js 14.2 호환
- 기존 워크플로우와의 호환성 유지

#### NFR3: 유지보수성

- 설정 파일 명확한 문서화
- 변경 이력 추적 가능
- 팀원 쉽게 이해 가능한 구조

#### NFR4: 확장성

- 향후 테스트 추가 용이
- 추가 검증 규칙 추가 용이
- 다른 브랜치 전략 적용 용이

## 5. 구현 계획

### 5.1 Phase 1: Git Hooks 완성 (0.5일)

#### 1.1 pre-commit 훅 정리

- 현재 주석만 있는 상태 유지 또는 제거
- 필요시 빠른 검증 로직 추가 가능하도록 구조화

#### 1.2 commit-msg 훅 검증

- 현재 설정이 올바르게 동작하는지 확인
- 에러 메시지 개선 (필요시)

#### 1.3 commitlint 설정 최적화

- `commitlint.config.js` 검토 및 개선
- 커밋 메시지 예시 추가

### 5.2 Phase 2: CI/CD 파이프라인 강화 (1일)

#### 2.1 Prettier 체크 추가

- `lint` job에 `format:check` 단계 추가
- 실패 시 명확한 에러 메시지

#### 2.2 PR 커밋 메시지 검증

- PR 제목 검증 job 추가 (선택적)
- PR 머지 커밋 메시지 검증

#### 2.3 CI 워크플로우 최적화

- 캐싱 전략 개선
- 병렬 실행 최적화
- 실패 시 빠른 피드백

#### 2.4 환경 변수 검증

- 필수 환경 변수 체크 (선택적)
- 빌드 시 환경 변수 검증

### 5.3 Phase 3: package.json 스크립트 추가 (0.5일)

#### 3.1 린트 스크립트

```json
{
  "lint": "next lint",
  "lint:fix": "next lint --fix"
}
```

#### 3.2 포맷팅 스크립트

```json
{
  "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
  "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\""
}
```

#### 3.3 통합 스크립트

```json
{
  "lint:all": "npm run lint && npm run format:check",
  "fix:all": "npm run lint:fix && npm run format"
}
```

### 5.4 Phase 4: 문서화 (1일)

#### 4.1 개발 워크플로우 가이드 작성

- `docs/development-workflow.md` 생성
- 커밋 메시지 작성 가이드
- Git hooks 동작 설명
- CI/CD 프로세스 설명

#### 4.2 문제 해결 가이드 작성

- 일반적인 오류 및 해결 방법
- 커밋 메시지 수정 방법
- CI 실패 대응 방법

#### 4.3 README 업데이트

- 새로운 스크립트 사용법 추가
- 워크플로우 링크 추가

### 5.5 Phase 5: 테스트 및 검증 (0.5일)

#### 5.1 Git Hooks 테스트

- 커밋 메시지 검증 테스트
- 잘못된 커밋 메시지 차단 확인
- 올바른 커밋 메시지 통과 확인

#### 5.2 CI 워크플로우 테스트

- 각 job 정상 동작 확인
- 병렬 실행 확인
- 실패 시나리오 테스트

#### 5.3 스크립트 테스트

- 모든 스크립트 실행 확인
- 예상 결과 확인

## 6. 구현 상세

### 6.1 Git Hooks 구조

```
.husky/
├── _/                    # Husky 내부 파일
├── commit-msg            # 커밋 메시지 검증
│   └── npx --no -- commitlint --edit ${1}
└── pre-commit           # pre-commit 검증 (선택적)
    └── # 현재 비활성화 또는 빠른 검증
```

### 6.2 CI 워크플로우 구조

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    - ESLint 체크
    - TypeScript 타입 체크
    - Prettier 포맷팅 체크

  build:
    - Next.js 빌드
    - 환경 변수 검증
```

### 6.3 commitlint 설정

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "refactor", "style", "test", "docs", "chore"]],
  },
};
```

### 6.4 package.json 스크립트

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "lint:all": "npm run lint && npm run format:check",
    "fix:all": "npm run lint:fix && npm run format",
    "prepare": "husky"
  }
}
```

## 7. 파일 구조

```
프로젝트 루트/
├── .husky/
│   ├── commit-msg          (커밋 메시지 검증)
│   └── pre-commit         (선택적)
├── .github/
│   └── workflows/
│       └── ci.yml         (CI 워크플로우)
├── commitlint.config.js   (커밋 메시지 규칙)
├── package.json           (스크립트 추가)
└── docs/
    ├── development-workflow.md  (신규)
    └── troubleshooting.md      (신규)
```

## 8. 위험 요소 및 대응 방안

### 8.1 위험 요소

| 위험                              | 영향도 | 대응 방안                                  |
| --------------------------------- | ------ | ------------------------------------------ |
| Git hooks가 너무 느려서 개발 방해 | 중간   | 최소한의 검증만 수행, CI에서 상세 검증     |
| CI 실행 시간 증가                 | 낮음   | 병렬 실행 및 캐싱으로 최적화               |
| 커밋 메시지 규칙이 너무 엄격함    | 낮음   | 규칙을 점진적으로 강화, 명확한 가이드 제공 |
| 팀원의 워크플로우 변경 필요       | 낮음   | 명확한 문서화 및 온보딩                    |
| 환경 변수 누락으로 인한 빌드 실패 | 중간   | 필수 환경 변수 명시 및 검증                |

### 8.2 롤백 계획

- Git hooks: `.husky/` 디렉토리 백업 또는 Git으로 복구
- CI 워크플로우: 이전 버전으로 롤백 가능
- package.json: 스크립트 제거로 롤백 가능

## 9. 검증 방법

### 9.1 기능 검증

- [ ] 커밋 메시지 검증 동작 확인
  - [ ] 올바른 형식: 통과 확인
  - [ ] 잘못된 형식: 차단 확인
- [ ] CI 워크플로우 정상 동작
  - [ ] lint job 성공
  - [ ] build job 성공
  - [ ] 병렬 실행 확인
- [ ] 스크립트 정상 동작
  - [ ] `npm run lint:fix` 동작 확인
  - [ ] `npm run format` 동작 확인
  - [ ] `npm run fix:all` 동작 확인

### 9.2 회귀 테스트

- [ ] 기존 커밋 메시지 형식 호환성 확인
- [ ] 기존 CI 워크플로우 동작 확인
- [ ] 빌드 성공 확인
- [ ] 개발 서버 정상 동작 확인

### 9.3 성능 테스트

- [ ] Git hooks 실행 시간 측정 (3초 이내)
- [ ] CI 실행 시간 측정 (10분 이내)
- [ ] 캐싱 효과 확인

## 10. 일정

| 단계     | 작업                  | 예상 소요 시간 | 담당   |
| -------- | --------------------- | -------------- | ------ |
| Phase 1  | Git Hooks 완성        | 0.5일          | 개발자 |
| Phase 2  | CI/CD 파이프라인 강화 | 1일            | 개발자 |
| Phase 3  | package.json 스크립트 | 0.5일          | 개발자 |
| Phase 4  | 문서화                | 1일            | 개발자 |
| Phase 5  | 테스트 및 검증        | 0.5일          | 개발자 |
| **총계** |                       | **3.5일**      |        |

## 11. 커밋 메시지 규칙 상세

### 11.1 형식

```
<type>: <subject>

<body>
```

### 11.2 타입 설명

- **feat**: 새로운 기능 추가, 기존 기능을 요구사항에 맞게 수정
- **fix**: 버그 수정
- **refactor**: 기능 변화 없이 코드 리팩터링 (변수명 변경 등)
- **style**: 코드 스타일, 포맷팅 수정
- **test**: 테스트 코드 추가/수정
- **docs**: 문서(주석) 수정
- **chore**: 패키지 매니저 수정, 기타 수정 (.gitignore 등)

### 11.3 예시

**올바른 예시:**

```
feat: 로그인 페이지 인풋 필드 디자인 업데이트

- border 색상을 border-k-100으로 명시
- 고정 높이 제거하여 padding과 line-height로 자동 계산
```

```
fix: 린트 에러 수정

- any 타입을 unknown으로 변경
- 중복된 className prop 제거
```

**잘못된 예시:**

```
update login page        # 타입 없음
feat login               # subject가 너무 짧음
FEAT: Login page update  # 대문자 타입
```

## 12. 개발 워크플로우

### 12.1 일반적인 워크플로우

1. **코드 작성**

   ```bash
   # 개발 중
   npm run dev
   ```

2. **코드 수정 후 검증**

   ```bash
   # 자동 수정 및 포맷팅
   npm run fix:all

   # 또는 개별 실행
   npm run lint:fix
   npm run format
   ```

3. **커밋**

   ```bash
   git add .
   git commit -m "feat: 새로운 기능 추가"
   # commitlint가 자동으로 검증
   ```

4. **푸시 및 PR**
   ```bash
   git push origin feature-branch
   # CI가 자동으로 실행
   ```

### 12.2 커밋 메시지 수정

커밋 메시지를 수정해야 하는 경우:

```bash
# 가장 최근 커밋 메시지 수정
git commit --amend -m "fix: 올바른 커밋 메시지"

# 이미 푸시한 경우
git push --force-with-lease origin branch-name
```

## 13. 문제 해결

### 13.1 커밋 메시지 검증 실패

**문제**: 커밋 메시지가 규칙에 맞지 않아 커밋 실패

**해결**:

1. 커밋 메시지 형식 확인: `<type>: <subject>`
2. 허용된 타입 확인: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`
3. 올바른 형식으로 다시 커밋

### 13.2 CI 실패

**문제**: CI에서 린트 또는 빌드 실패

**해결**:

1. 로컬에서 동일한 명령어 실행
   ```bash
   npm run lint:all
   npm run build
   ```
2. 오류 수정
3. 자동 수정 시도
   ```bash
   npm run fix:all
   ```
4. 수정 후 다시 푸시

### 13.3 Git hooks가 동작하지 않음

**문제**: 커밋 시 commitlint가 실행되지 않음

**해결**:

1. Husky 설치 확인
   ```bash
   npm run prepare
   ```
2. `.husky/commit-msg` 파일 확인
3. 실행 권한 확인
   ```bash
   chmod +x .husky/commit-msg
   ```

## 14. 후속 작업

### 14.1 단기 (1주 이내)

- 팀원 대상 워크플로우 공유
- 커밋 메시지 가이드 공유
- CI/CD 프로세스 설명

### 14.2 중기 (1개월 이내)

- 테스트 코드 추가 및 CI 통합
- 추가 린트 규칙 도입 검토
- 코드 커버리지 측정 도입 검토
- Pre-commit 훅 활성화 검토 (필요시)

### 14.3 장기 (3개월 이내)

- ESLint 9.0+ Flat Config 마이그레이션
- 자동화된 코드 리뷰 도구 도입 검토
- 성능 모니터링 통합

## 15. 참고 자료

- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Next.js ESLint Configuration](https://nextjs.org/docs/app/building-your-application/configuring/eslint)

## 16. 승인

- [ ] 기술 리더 승인
- [ ] 팀 리뷰 완료
- [ ] 일정 확정

---

**작성일**: 2025-01-XX  
**작성자**: 개발팀  
**버전**: 1.0

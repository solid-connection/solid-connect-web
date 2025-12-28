# ESLint & Prettier 마이그레이션 PRD

## 1. 개요

### 1.1 목적

현재 프로젝트의 ESLint와 Prettier 설정을 개선하고, 개발 워크플로우에 자동 린팅 및 포맷팅 기능을 추가하여 코드 품질과 일관성을 향상시킵니다.

### 1.2 배경

- 현재 `.eslintrc.json` 파일에 주석이 포함되어 있어 JSON 파싱 오류 가능성
- `npm run lint` 명령어만 존재하며 자동 수정 기능 없음
- 린트 자동 수정 및 포맷팅을 위한 명령어 부재
- 개발자 경험(DX) 개선 필요

## 2. 현재 상황 분석

### 2.1 현재 설정

- **ESLint**: `8.56.0` 사용, `.eslintrc.json` 형식
- **Prettier**: `.prettierrc.json` 설정 파일 존재
- **스크립트**: `npm run lint` (체크만 수행)
- **통합**: `eslint-config-prettier`로 충돌 방지 설정됨

### 2.2 문제점

1. `.eslintrc.json`에 주석이 포함되어 있어 유효하지 않은 JSON 형식
2. 자동 수정 명령어 부재 (`--fix` 옵션 미사용)
3. Prettier 포맷팅 명령어 부재
4. 개발 중 자동 포맷팅/린팅 워크플로우 없음

## 3. 목표

### 3.1 주요 목표

1. ESLint 설정을 `.eslintrc.js`로 마이그레이션하여 주석 지원 및 동적 구성 가능
2. 자동 수정 및 포맷팅 명령어 추가
3. 개발 워크플로우에 자동 린팅/포맷팅 통합
4. CI/CD 파이프라인과의 일관성 유지

### 3.2 성공 지표

- 모든 린트 오류 자동 수정 가능
- 일관된 코드 포맷팅 적용
- 개발자 생산성 향상 (수동 수정 시간 감소)
- 코드 리뷰 시 스타일 관련 논의 감소

## 4. 요구사항

### 4.1 기능 요구사항

#### FR1: ESLint 설정 마이그레이션

- `.eslintrc.json` → `.eslintrc.js` 변환
- 기존 설정 유지 (규칙, 플러그인, 확장)
- 주석 지원으로 설정 문서화 개선

#### FR2: 자동 수정 명령어 추가

- `npm run lint:fix`: ESLint 자동 수정
- `npm run format`: Prettier 포맷팅
- `npm run format:check`: Prettier 포맷팅 체크 (CI용)

#### FR3: 통합 명령어

- `npm run lint:all`: 린트 체크 + 자동 수정 + 포맷팅 체크
- `npm run fix:all`: 린트 자동 수정 + 포맷팅 적용

#### FR4: 개발 워크플로우 통합

- VS Code 설정 파일 추가 (선택사항)
- Git hooks 통합 (이미 Husky 설정됨)

### 4.2 비기능 요구사항

#### NFR1: 호환성

- 기존 ESLint 규칙과 100% 호환
- 기존 Prettier 설정 유지
- Next.js 14.2와 호환

#### NFR2: 성능

- 린트 실행 시간: 기존과 동일 수준 유지
- 포맷팅 실행 시간: 전체 프로젝트 기준 10초 이내

#### NFR3: 유지보수성

- 설정 파일에 주석으로 문서화
- 명확한 명령어 네이밍
- README에 사용법 문서화

## 5. 마이그레이션 계획

### 5.1 단계별 계획

#### Phase 1: 설정 파일 마이그레이션 (1일)

1. `.eslintrc.json` → `.eslintrc.js` 변환
   - 주석을 유효한 JavaScript 주석으로 변환
   - 기존 설정 100% 유지
   - 테스트: `npm run lint` 실행하여 동일한 결과 확인

2. Prettier 설정 검증
   - `.prettierrc.json` 설정 확인
   - ESLint와의 충돌 확인

#### Phase 2: 명령어 추가 (0.5일)

1. `package.json` 스크립트 추가

   ```json
   {
     "lint": "next lint",
     "lint:fix": "next lint --fix",
     "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
     "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
     "lint:all": "npm run lint && npm run format:check",
     "fix:all": "npm run lint:fix && npm run format"
   }
   ```

2. `.prettierignore` 파일 생성 (필요시)

#### Phase 3: 테스트 및 검증 (0.5일)

1. 명령어 테스트
   - 각 명령어 실행 및 결과 확인
   - CI 워크플로우와의 호환성 확인

2. 문서화
   - `README.md` 또는 `docs/`에 사용법 추가
   - 팀 공유

#### Phase 4: 통합 및 배포 (0.5일)

1. Git hooks 업데이트 (선택사항)
   - pre-commit에 `lint:fix` 추가 검토
   - 현재는 commitlint만 사용 중이므로 선택사항

2. CI/CD 확인
   - 기존 CI 워크플로우 동작 확인
   - 필요시 `format:check` 추가

### 5.2 파일 구조

```text
프로젝트 루트/
├── .eslintrc.js          (신규, .eslintrc.json 대체)
├── .eslintrc.json        (삭제)
├── .prettierrc.json      (기존 유지)
├── .prettierignore       (신규, 필요시)
├── package.json          (스크립트 추가)
└── docs/
    └── eslint-prettier-migration-prd.md (이 문서)
```

## 6. 구현 상세

### 6.1 ESLint 설정 변환

#### 현재 (.eslintrc.json)

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  ...
}
```

#### 변환 후 (.eslintrc.js)

```javascript
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  // 주석 지원 가능
  ...
};
```

### 6.2 package.json 스크립트

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
    "fix:all": "npm run lint:fix && npm run format"
  }
}
```

### 6.3 .prettierignore (필요시)

```gitignore
node_modules
.next
out
build
dist
*.min.js
package-lock.json
```

## 7. 위험 요소 및 대응 방안

### 7.1 위험 요소

| 위험                                 | 영향도 | 대응 방안                                   |
| ------------------------------------ | ------ | ------------------------------------------- |
| 기존 설정과의 불일치                 | 높음   | Phase 1에서 철저한 테스트, 기존 결과와 비교 |
| 대량 파일 변경으로 인한 PR 크기 증가 | 중간   | 단계별 커밋, 마이그레이션과 포맷팅 분리     |
| 팀원의 워크플로우 변경 필요          | 낮음   | 명확한 문서화 및 공유                       |

### 7.2 롤백 계획

- `.eslintrc.json` 백업 유지
- Git을 통한 이전 버전 복구 가능
- 단계별 커밋으로 선택적 롤백 가능

## 8. 검증 방법

### 8.1 기능 검증

- [ ] `.eslintrc.js`로 동일한 린트 결과 확인
- [ ] `npm run lint:fix`로 자동 수정 동작 확인
- [ ] `npm run format`으로 포맷팅 동작 확인
- [ ] CI 워크플로우 정상 동작 확인

### 8.2 회귀 테스트

- [ ] 기존 린트 경고/에러 개수 동일
- [ ] 빌드 성공 확인
- [ ] 개발 서버 정상 동작 확인

## 9. 일정

| 단계     | 작업                   | 예상 소요 시간 | 담당   |
| -------- | ---------------------- | -------------- | ------ |
| Phase 1  | 설정 파일 마이그레이션 | 1일            | 개발자 |
| Phase 2  | 명령어 추가            | 0.5일          | 개발자 |
| Phase 3  | 테스트 및 검증         | 0.5일          | 개발자 |
| Phase 4  | 통합 및 배포           | 0.5일          | 개발자 |
| **총계** |                        | **2.5일**      |        |

## 10. 후속 작업

### 10.1 단기 (1주 이내)

- 팀원 대상 사용법 공유
- VS Code 설정 파일 추가 (선택사항)
- Git hooks에 자동 포맷팅 추가 검토

### 10.2 중기 (1개월 이내)

- ESLint 9.0+ Flat Config 마이그레이션 검토
- 추가 린트 규칙 도입 검토
- 코드 리뷰 가이드라인 업데이트

## 11. 참고 자료

- [ESLint Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [Next.js ESLint Configuration](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)

## 12. 승인

- [ ] 기술 리더 승인
- [ ] 팀 리뷰 완료
- [ ] 일정 확정

---

**작성일**: 2025-01-XX  
**작성자**: 개발팀  
**버전**: 1.0

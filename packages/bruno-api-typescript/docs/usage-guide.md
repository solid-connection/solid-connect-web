# 사용 방법 가이드

> 이 문서는 `bruno-api-typescript`를 실제 프로젝트에서 사용하는 방법을 설명합니다.

## 목표

- Bruno `.bru` 정의로부터 **OpenAPI 스펙**과 **타입 안전한 API 클라이언트**를 생성합니다.
- 빌드/개발 과정에서 **항상 최신 스키마**를 바라보도록 실행 흐름을 구성합니다.

## 사전 준비

1. **Node.js 18+**
2. Bruno `.bru` 파일이 있는 디렉토리
3. `npm install` 및 `npm run build` 완료

## 핵심 명령어

### 1) OpenAPI 생성

```bash
node dist/cli/index.js generate -i ./bruno -o ./openapi.json
```

### 2) API 클라이언트/정의 생성

```bash
node dist/cli/index.js generate-hooks -i ./bruno -o ./src/apis
```

**옵션 예시**:

```bash
node dist/cli/index.js generate-hooks \
  -i ./bruno \
  -o ./src/apis \
  --axios-path "@/utils/axiosInstance" \
  --root-index ./src/apis/index.ts \
  --clean-output \
  --msw-output ./src/mocks
```

## 권장 파일 구조

```
bruno/
├── users/
│   └── profile.bru
└── applications/
    └── create-application.bru

src/
└── apis/
    ├── users/
    │   ├── api.ts
    │   ├── apiDefinitions.ts
    │   └── index.ts
    └── applications/
        ├── api.ts
        ├── apiDefinitions.ts
        └── index.ts
```

## 생성 결과 사용법

### API 호출

```ts
import { usersApi } from '@/apis/users';

const profile = await usersApi.getGetProfile({
  params: { includeDetails: true },
});
```

### API 정의 메타데이터

```ts
import { usersApiDefinitions } from '@/apis/users';

const def = usersApiDefinitions.getGetProfile;
console.log(def.method); // 'GET'
console.log(def.path);   // '/users/profile'

type ProfileResponse = typeof def.response;
```

## 빌드/개발 파이프라인에 통합하기

### ✅ 목표: 항상 최신 스키마를 바라보도록 자동 생성

빌드 또는 개발 실행 전에 자동으로 OpenAPI/클라이언트를 생성하도록 **스크립트를 연결**합니다.

#### 예시: `package.json` 스크립트

```json
{
  "scripts": {
    "api:generate": "node dist/cli/index.js generate -i ./bruno -o ./openapi.json",
    "api:clients": "node dist/cli/index.js generate-hooks -i ./bruno -o ./src/apis --root-index ./src/apis/index.ts --clean-output",
    "build": "npm run api:generate && npm run api:clients && tsc",
    "dev": "npm run api:generate && npm run api:clients && tsc --watch"
  }
}
```

> 이렇게 구성하면 **빌드와 개발 실행 시 항상 최신 스키마/클라이언트를 보장**합니다.

## 자주 묻는 질문

### Q. 생성 파일을 수정해도 되나요?

A. 안 됩니다. `api.ts`, `apiDefinitions.ts`는 자동 생성 파일이며, 다음 실행 시 덮어쓰기됩니다.

### Q. 커스텀 로직은 어디에 두나요?

`src/hooks/` 또는 별도 레이어에서 API 클라이언트를 불러와 사용하는 것을 권장합니다.

## 관련 문서

- [Bruno 파일 작성 가이드](./bruno-guide.md)
- [Bruno 파일 작성 튜토리얼](./bruno-tutorial.md)
- [변경사항 처리 가이드](./migration-guide.md)

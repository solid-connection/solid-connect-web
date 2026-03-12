# API 클라이언트 변경사항 처리 가이드

## 개요

이 프로젝트는 Bruno 파일에서 타입 안전한 API 클라이언트를 자동 생성합니다. 변경사항은 다음과 같이 처리됩니다:

1. **API 팩토리 (api.ts)**: 항상 덮어쓰기 (최신 API 시그니처 유지)
2. **API 정의 (apiDefinitions.ts)**: 항상 덮어쓰기 (타입 메타데이터 최신화)

## 파일 구조

```
src/apis/
├── Auth/
│   ├── api.ts                    # API 팩토리 (항상 덮어쓰기)
│   ├── apiDefinitions.ts         # 타입 정의 (항상 덮어쓰기)
│   └── index.ts
```

## 동작 방식

### 1. 새 API 추가 시

새 API가 추가되면 팩토리와 정의 파일이 업데이트됩니다.

```
Auth/
├── api.ts             # authApi.postSignOut 추가됨
├── apiDefinitions.ts  # postSignOut 타입 정의 추가됨
└── index.ts
```

### 2. 기존 API 변경 시

API 시그니처가 변경되면 자동으로 반영됩니다.

```
Auth/
├── api.ts             # authApi.postSignOut 업데이트됨
├── apiDefinitions.ts  # postSignOut 타입 정의 업데이트됨
└── index.ts
```

## 사용 방법

### API 호출

생성된 API 클라이언트는 다음과 같이 사용합니다:

```typescript
import { authApi } from '@/apis/Auth';

// GET 요청
const profile = await authApi.getProfile({ params: { includeDetails: true } });

// POST 요청
const result = await authApi.postSignOut({ data: {} });
```


## 타입 정의 활용

### API 메타데이터 확인

`apiDefinitions.ts`는 각 API의 타입 메타데이터를 제공합니다:

```typescript
import { authApiDefinitions } from '@/apis/Auth';

// API 메타데이터 확인
const signOutDef = authApiDefinitions.postSignOut;
console.log(signOutDef.method);   // 'POST'
console.log(signOutDef.path);     // '/auth/sign-out'

// 타입 추론
type SignOutRequest = typeof signOutDef.body;
type SignOutResponse = typeof signOutDef.response;
```

### 타입 안전성

모든 API 호출은 완전한 타입 안전성을 제공합니다:

```typescript
// ✅ 올바른 사용
await authApi.postSignOut({ 
  data: { /* PostSignOutRequest 타입 */ } 
});

// ❌ 컴파일 에러
await authApi.postSignOut({ 
  data: { invalidField: true }  // 타입 에러
});
```

## 주의사항

### 생성 파일 커스터마이징 금지

`api.ts`와 `apiDefinitions.ts` 파일은 항상 덮어쓰기되므로, 이 파일들을 직접 수정하지 마세요.

### 커스텀 로직 분리

비즈니스 로직이나 커스텀 훅은 별도 파일로 관리하세요:

```
src/
├── apis/
│   └── Auth/
│       ├── api.ts              # 자동 생성 (수정 금지)
│       └── apiDefinitions.ts   # 자동 생성 (수정 금지)
└── hooks/
    └── useAuth.ts             # 커스텀 훅 (자유롭게 수정)
```

## 자주 묻는 질문

### Q: API 팩토리 파일을 수정해도 되나요?

A: 아니요. `api.ts`와 `apiDefinitions.ts`는 자동 생성 파일이므로 수정하지 마세요. 다음 생성 시 덮어쓰기됩니다.

### Q: 커스텀 로직은 어디에 추가하나요?

A: 별도의 훅 파일(`src/hooks/`)을 만들어 커스텀 로직을 관리하세요. 자동 생성된 API 클라이언트를 import하여 사용합니다.

### Q: API 클라이언트를 직접 사용해도 되나요?

A: 네, API 클라이언트와 API 정의는 독립적으로 사용할 수 있습니다. 필요하다면 별도의 레이어에서 커스텀 훅을 만들어 사용하세요.

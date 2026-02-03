# Bruno 파일 작성 가이드 (백엔드 개발자용)

> **핵심**: `docs` 블록에 응답 JSON을 정확히 작성하면 끝입니다.

## 기본 구조

`````bru
meta {
  name: API 이름
  type: http
}

get /api/endpoint

headers {
  Authorization: Bearer {{token}}
}

body:json {
  {
    "key": "value"
  }
}

docs {
  ````json
  {
    "id": 1,
    "username": "johndoe"
  }
  ````
}
`````

## 필수 작성 규칙

### 1. `docs` 블록이 핵심

**`docs` 블록이 전부입니다!** 이 블록의 JSON으로 타입과 스키마가 자동 생성됩니다.

**올바른 예시 (단일 응답):**

`````bru
docs {
  ````json
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-01-01T00:00:00Z",
    "profile": {
      "age": 25,
      "city": "Seoul"
    },
    "tags": ["developer", "backend"]
  }
  ````
}
`````

**올바른 예시 (상태 코드별 응답):**

여러 상태 코드를 정의할 수 있지만, **200 OK만 사용**됩니다:

````bru
docs {
  ## 200 OK
  ```
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
  ```

  ## 404 Not Found
  ```
  {
    "message": "사용자를 찾을 수 없습니다."
  }
  ```
}
````

**⚠️ 중요**: 현재는 **200 OK 응답만 타입 생성에 사용**됩니다. 다른 상태 코드(404, 500 등)는 문서화 목적으로만 작성할 수 있습니다.

### 1-1. 200 OK 응답 필수 작성

**200 OK 응답이 없으면 타입 생성이 실패합니다!**

**❌ 잘못된 예시 (200 OK 없음):**

````bru
docs {
  ## 404 Not Found
  ```
  {
    "message": "사용자를 찾을 수 없습니다."
  }
  ```
}
````

**✅ 올바른 예시:**

````bru
docs {
  ## 200 OK
  ```
  {
    "id": 1,
    "username": "johndoe"
  }
  ```

  ## 404 Not Found
  ```
  {
    "message": "사용자를 찾을 수 없습니다."
  }
  ```
}
````

**주의사항:**

- 200 OK 응답이 여러 개 있으면 **첫 번째만** 사용됩니다
- 200 OK 응답의 JSON이 실제 응답과 **정확히 일치**해야 합니다
- 200 OK 응답이 없으면 단일 JSON 코드 블록을 찾지만, 그것도 없으면 타입 생성 실패

### 2. JSON 작성 규칙

- ✅ **실제 응답과 동일하게** 작성
- ✅ **모든 필드를 포함** (옵셔널 필드도)
- ✅ **타입이 명확한 값 사용**:
  - 문자열: `"hello"`
  - 숫자: `123` 또는 `4.5`
  - 불린: `true` / `false`
  - 배열: `[1, 2, 3]` (최소 1개 요소 포함)
  - 객체: `{ "key": "value" }`
  - null: `null`
- ✅ **날짜는 ISO 8601 형식**: `"2025-01-01T00:00:00Z"`

### 3. 자주 하는 실수

**❌ 잘못된 예시:**

`````bru
docs {
  ````json
  {
    id: 1,  // 키에 따옴표 없음
    "name": '홍길동'  // 작은따옴표 사용
  }
  ````
}
`````

**❌ 빈 배열:**

`````bru
docs {
  ````json
  {
    "users": []  // 타입 추론 불가 → any[]로 추론됨
  }
  ````
}
`````

**⚠️ 주의**: 빈 배열은 `any[]`로 추론되므로, 최소 1개 요소를 포함해야 합니다.

**❌ null 값으로 인한 타입 오류:**

null 값이 있으면 해당 필드의 타입이 `null`로 고정되어 실제 사용 시 타입 오류가 발생할 수 있습니다.

`````bru
docs {
  ````json
  {
    "optionalField": null  // null로 추론되어 타입이 null로 고정됨
  }
  ````
}
`````

**✅ 올바른 예시 (옵셔널 필드 - 배열에서 유니온 타입 생성):**

배열 응답에서 여러 아이템을 확인하여 유니온 타입을 자동 생성합니다:

`````bru
docs {
  ````json
  [
    {
      "status": "active",
      "data": "hello",
      "optionalField": "value"
    },
    {
      "status": null,
      "data": null,
      "optionalField": null
    }
  ]
  ````
}
`````

**생성되는 타입:**

```typescript
export interface ResponseItem {
  status: "active" | null;
  data: "hello" | null;
  optionalField: "value" | null;
}
```

**✅ 단일 객체에서 옵셔널 필드:**

단일 객체의 경우 null 값은 `null` 타입으로만 추론됩니다. 옵셔널 필드를 표현하려면 배열로 작성하세요:

`````bru
docs {
  ````json
  {
    "requiredField": "value",
    "optionalField": "example"  // 실제 값으로 작성
  }
  ````
}
`````

**✅ 올바른 예시:**

`````bru
docs {
  ````json
  {
    "users": [
      {
        "id": 1,
        "name": "예시"
      }
    ]
  }
  ````
}
`````

## 파일명 및 폴더명 가이드라인

파일명과 폴더명은 생성되는 코드의 구조와 이름에 직접 영향을 미칩니다. 일관된 네이밍을 위해 다음 규칙을 따르세요.

### 폴더명 규칙

폴더명은 생성되는 도메인 디렉토리 이름이 됩니다.

#### 지원하는 형식

1. **`숫자) 한글명 [영문키]` 형식** (권장)

   ```
   1) 어드민 [Admin]/          → 생성 폴더: Admin
   7) 어드민 [Admin]/          → 생성 폴더: Admin
   8) 사용자 [Users]/          → 생성 폴더: Users
   9) 멘토 [Mentor]/           → 생성 폴더: Mentor
   ```

   - 대괄호 안의 `영문키`만 사용됩니다
   - 숫자와 한글명은 가독성을 위해 사용, 실제 폴더명에는 포함되지 않음

2. **`한글명 [영문키]` 형식** (기존 방식, 호환)

   ```
   지원서 [applications]/    → 생성 폴더: applications
   사용자 [users]/            → 생성 폴더: users
   ```

   - 대괄호 안의 `영문키`만 사용됩니다
   - 기존 프로젝트와 호환됩니다

3. **영문 폴더명** (가장 단순)
   ```
   applications/              → 생성 폴더: applications
   users/                     → 생성 폴더: users
   ```
   - 패턴이 없으면 폴더명 그대로 사용

#### 폴더명 예시

| Bruno 폴더명            | 생성되는 폴더  | 설명                  |
| ----------------------- | -------------- | --------------------- |
| `1) 어드민 [Admin]`     | `Admin`        | 대괄호 안의 키만 사용 |
| `7) 어드민 [Admin]`     | `Admin`        | 숫자는 무시됨         |
| `지원서 [applications]` | `applications` | 대괄호 안의 키만 사용 |
| `users`                 | `users`        | 그대로 사용           |

### 파일명 규칙

**파일명이 API 함수 이름에 직접 사용됩니다!**

> ⚠️ **중요**: 파일명에 **HTTP 메서드를 포함하지 마세요**. 메서드는 `.bru` 파일 내부의 `get`, `post`, `put`, `patch`, `delete` 블록에서 자동으로 인식됩니다.

#### 지원하는 형식

1. **`한글명 [영문키]` 형식** (권장, 폴더명과 동일한 패턴)

   ```
   멘토 목록 조회 [mentor-list].bru     → mentor-list → mentorList → getMentorList
   사용자 프로필 [user-profile].bru      → user-profile → userProfile → getUserProfile
   지원서 생성 [create-application].bru → create-application → createApplication → postCreateApplication
   ```

   - 대괄호 안의 `영문키`만 사용됩니다
   - 한글명은 가독성을 위해 사용, 실제 코드 생성에는 포함되지 않음
   - **HTTP 메서드 prefix는 자동으로 제거됩니다** (예: `delete-account` → `account`)

2. **영문 파일명** (기존 방식, 호환)

   ```
   competitors.bru        → competitors → getCompetitors
   user-profile.bru       → user-profile → getUserProfile
   create-application.bru → create-application → postCreateApplication
   ```

   - 패턴이 없으면 파일명 그대로 사용
   - **HTTP 메서드 prefix는 자동으로 제거됩니다**

#### 권장 형식

**✅ 올바른 예시:**

```
멘토 목록 조회 [mentor-list].bru        → mentorList → getMentorList
사용자 프로필 [user-profile].bru         → userProfile → getUserProfile
지원서 생성 [create-application].bru     → createApplication → postCreateApplication
프로필 수정 [update-profile].bru          → updateProfile → putUpdateProfile
회원 탈퇴 [account].bru                   → account → deleteAccount
```

**❌ 잘못된 예시 (HTTP 메서드 포함):**

```
멘토 목록 조회 [get-mentor-list].bru     → getMentorList → getGetMentorList (중복!)
사용자 삭제 [delete-user].bru            → deleteUser → deleteDeleteUser (중복!)
```

#### 네이밍 규칙

1. **kebab-case 사용** (하이픈으로 단어 구분)

   - ✅ `user-profile.bru`
   - ❌ `userProfile.bru` (camelCase)
   - ❌ `user_profile.bru` (snake_case)
   - ❌ `UserProfile.bru` (PascalCase)

2. **HTTP 메서드 포함하지 않기** (필수)

   - ✅ `account.bru` (DELETE 메서드 → deleteAccount)
   - ✅ `sign-up.bru` (POST 메서드 → postSignUp)
   - ✅ `mentor-list.bru` (GET 메서드 → getMentorList)
   - ❌ `delete-account.bru` (메서드 중복 → deleteDeleteAccount)
   - ❌ `post-sign-up.bru` (메서드 중복 → postPostSignUp)

3. **명확하고 간결한 이름**

   - ✅ `competitors.bru` (명확함)
   - ✅ `create-application.bru` (명확함)
   - ❌ `api1.bru` (불명확)
   - ❌ `test.bru` (불명확)

4. **한글 파일명 피하기**
   - ❌ `멘토 목록 조회.bru` (함수 이름 생성 시 문제 가능)
   - ✅ `mentor-list.bru` (영문 사용)

#### 파일명 예시

| Bruno 파일명                       | HTTP 메서드 | 추출된 키        | 함수 이름         |
| ---------------------------------- | ----------- | ---------------- | ----------------- |
| `멘토 목록 조회 [mentor-list].bru` | GET         | `mentor-list`    | `getMentorList`   |
| `사용자 프로필 [user-profile].bru` | GET         | `user-profile`   | `getUserProfile`  |
| `지원서 생성 [create].bru`         | POST        | `create`         | `postCreate`      |
| `회원 탈퇴 [account].bru`          | DELETE      | `account`        | `deleteAccount`   |
| `competitors.bru`                  | GET         | `competitors`    | `getCompetitors`  |
| `멘토 목록 조회.bru`               | GET         | `멘토 목록 조회` | `get멘토목록조회` ❌ |

**핵심**:

- `한글명 [영문키]` 형식으로 작성하면 한글 설명과 영문 코드를 모두 활용할 수 있습니다
- 대괄호 안의 영문키만 kebab-case로 작성하면, 자동으로 일관된 API 함수 이름이 생성됩니다!
- **HTTP 메서드는 파일명에 포함하지 마세요** - `.bru` 파일 내부에서 자동으로 인식됩니다!

### 전체 구조 예시

```
bruno/
├── 7) 어드민 [Admin]/                              # 폴더명: Admin
│   ├── 목록 조회 [list].bru                       # → adminApi.getList
│   ├── 생성 [create].bru                          # → adminApi.postCreate
│   └── 수정 [update].bru                          # → adminApi.putUpdate
├── 지원서 [applications]/                        # 폴더명: applications
│   ├── 경쟁자 조회 [competitors].bru               # → applicationsApi.getCompetitors
│   ├── 상세 조회 [details].bru                     # → applicationsApi.getDetails
│   └── 지원서 생성 [create].bru                    # → applicationsApi.postCreate
├── 사용자 [users]/                                # 폴더명: users
│   ├── 프로필 조회 [profile].bru                  # → usersApi.getProfile
│   └── 프로필 수정 [update-profile].bru            # → usersApi.putUpdateProfile
└── bruno.json
```

**생성되는 구조:**

```
src/apis/
├── Admin/
│   ├── api.ts                # adminApi 팩토리
│   ├── apiDefinitions.ts     # 타입 정의
│   └── index.ts
├── applications/
│   ├── api.ts                # applicationsApi 팩토리
│   ├── apiDefinitions.ts     # 타입 정의
│   └── index.ts
├── users/
│   ├── api.ts                # usersApi 팩토리
│   ├── apiDefinitions.ts     # 타입 정의
│   └── index.ts
```

## 실전 예시

### GET - 목록 조회

`````bru
meta {
  name: Get Competitors
  type: http
}

get /applications/competitors

headers {
  Authorization: Bearer {{token}}
}

docs {
  ````json
  {
    "firstChoice": [
      {
        "universityId": 1,
        "koreanName": "데겐도르프대학",
        "studentCapacity": 150,
        "applicantCount": 120
      }
    ],
    "secondChoice": [],
    "thirdChoice": []
  }
  ````
}
`````

### POST - 생성

`````bru
meta {
  name: Create Application
  type: http
}

post /applications

headers {
  Authorization: Bearer {{token}}
  Content-Type: application/json
}

body:json {
  {
    "universityId": 1,
    "choice": "first"
  }
}

docs {
  ````json
  {
    "id": 123,
    "status": "pending",
    "submittedAt": "2025-11-12T05:30:00Z"
  }
  ````
}
`````

### GET - 상세 조회 (Path Parameter)

`````bru
meta {
  name: Get Application Detail
  type: http
}

get /applications/:id

headers {
  Authorization: Bearer {{token}}
}

docs {
  ````json
  {
    "id": 123,
    "userId": 456,
    "status": "approved",
    "reviewer": {
      "id": 789,
      "name": "심사자"
    }
  }
  ````
}
`````

## MSW 생성 제어

MSW 핸들러는 모든 API에 대해 생성되며, **프론트엔드에서 플래그로 활성/비활성을 제어**합니다.

### 프론트엔드에서 MSW 제어

생성된 `handlers.ts` 파일에서 환경 변수나 설정으로 제어할 수 있습니다:

**예시 1: 환경 변수로 제어**

```typescript
// src/mocks/handlers.ts
import { authHandlers } from "./Auth";
import { usersHandlers } from "./Users";

const ENABLE_MSW = process.env.NEXT_PUBLIC_ENABLE_MSW === "true";

export const handlers = ENABLE_MSW ? [...authHandlers, ...usersHandlers] : [];
```

**예시 2: 특정 도메인만 활성화**

```typescript
export const handlers = [
  ...authHandlers, // Auth 도메인만 활성화
  // ...usersHandlers,  // Users 도메인 비활성화
];
```

**예시 3: 조건부 필터링**

```typescript
const enabledDomains = ["Auth", "Users"]; // 활성화할 도메인 목록

export const handlers = [
  ...(enabledDomains.includes("Auth") ? authHandlers : []),
  ...(enabledDomains.includes("Users") ? usersHandlers : []),
];
```

## 체크리스트

새 API 엔드포인트를 만들 때:

- [ ] `meta` 블록 작성 (name 필수)
- [ ] HTTP 메서드와 경로 명확히 표기
- [ ] 인증 필요시 `headers` 블록에 Authorization
- [ ] POST/PUT이면 `body:json` 블록 작성
- [ ] **`docs` 블록 반드시 작성** (가장 중요!)
- [ ] JSON이 유효한가? (온라인 validator로 확인)
- [ ] 모든 필드가 포함되었나?
- [ ] 배열에 최소 1개 요소가 있나?
- [ ] 날짜는 ISO 8601 형식인가?

## 빠른 템플릿

### GET 템플릿

````bru
meta {
  name: [API 이름]
  type: http
}

get /[경로]

headers {
  Authorization: Bearer {{token}}
}

docs {
  ```json
  {
    "id": 1,
    "field": "value"
  }
````

}

````

### POST 템플릿

```bru
meta {
  name: [API 이름]
  type: http
}

post /[경로]

headers {
  Authorization: Bearer {{token}}
  Content-Type: application/json
}

body:json {
  {
    "field": "value"
  }
}

docs {
  ```json
  {
    "id": 1,
    "status": "success"
  }
````

}

```

## 문제 해결

1. **파싱 에러**: docs 블록의 JSON을 복사해서 [JSONLint](https://jsonlint.com/)로 검증
2. **타입이 이상함**: 값의 타입 확인 (숫자는 따옴표 없이, 문자열은 따옴표)
3. **필드가 안보임**: docs 블록에 해당 필드 추가했는지 확인

---

**핵심은 `docs` 블록을 정확하게 작성하는 것!**
```

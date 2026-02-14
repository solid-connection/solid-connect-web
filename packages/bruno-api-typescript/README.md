# bruno-api-typescript

> **Bruno 파일을 작성하면, 나머지는 자동으로**

이 프로젝트는 Bruno `.bru` 파일을 OpenAPI 스펙과 타입 안전한 API 클라이언트로 자동 변환하는 GitHub Apps 기반 자동화 도구입니다.

백엔드 개발자는 Bruno 파일만 작성하면, GitHub Actions가 자동으로 프론트엔드 저장소에 타입 정의와 API 클라이언트를 생성하고 PR을 만들어줍니다.

## 작동 방식

```mermaid
graph LR
    A[백엔드: Bruno 파일 수정] --> B[GitHub Push]
    B --> C[GitHub Actions 실행]
    C --> D[OpenAPI 생성]
    C --> E[API 클라이언트 생성]
    E --> F[프론트엔드 저장소 PR 자동 생성]
```

## 설정 방법 (5단계)

### 1단계: 저장소 준비

```bash
# Bruno API 저장소 클론
git clone https://github.com/solid-connection/bruno-api-typescript.git
cd bruno-api-typescript

# 의존성 설치 및 빌드
npm install
npm run build
```

### 2단계: GitHub App 생성

GitHub Settings → Developer settings → GitHub Apps → New GitHub App

필수 권한:

- **Contents**: Read & Write
- **Pull requests**: Read & Write
- **Workflows**: Read & Write

생성 후:

- **App ID** 복사
- **Private Key** 다운로드

### 3단계: Secrets 설정

Bruno 저장소와 프론트엔드 저장소 모두에 Secrets 추가:

- `APP_ID`: GitHub App ID
- `APP_PRIVATE_KEY`: Private Key 전체 내용
- `INSTALLATION_ID`: Installation ID

### 4단계: Workflow 파일 추가

`.github/workflows/sync-to-frontend.yml` 파일 생성 (자세한 내용은 [설정 가이드](./docs/github-apps-simple.md) 참조)

### 5단계: Bruno 파일 작성 및 푸시

Bruno 파일 작성 후 푸시하면 자동으로 프론트엔드에 PR 생성!

## Bruno 파일 작성 예시

`````bru
meta {
  name: Get User Profile
  type: http
}

get /users/profile

headers {
  Authorization: Bearer {{token}}
}

docs {
  ````json
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-01-01T00:00:00Z"
  }
  ````
}
`````

**핵심**: `docs` 블록에 실제 API 응답 JSON을 작성하면, 이를 기반으로 타입과 스키마가 자동 생성됩니다.

## 추가 문서

- **[사용 방법 가이드](./docs/usage-guide.md)** - CLI 사용법과 프로젝트 통합 방법
- **[GitHub Apps 설정 가이드](./docs/github-apps-simple.md)** - Workflow 파일 예시 포함
- **[Bruno 파일 작성 튜토리얼](./docs/bruno-tutorial.md)** - 단계별 따라하기
- **[Bruno 파일 작성 가이드](./docs/bruno-guide.md)** - 상세 레퍼런스
- **[변경사항 처리 가이드](./docs/migration-guide.md)** - API 클라이언트 변경사항 처리 방법

## 라이선스

MIT

---

**v0.3.0** | 문의: hanmw110@naver.com

# Bruno API TypeScript 사용 가이드

이 문서는 `bruno-api-typescript`를 사용해 공통 API 스키마를 생성하고, 어드민/웹에서 공유하는 방법을 정리합니다.

## 1) 개념 요약

- Bruno `.bru` 파일을 기반으로 **TypeScript API 스키마(클라이언트 코드)** 를 자동 생성합니다.
- 생성된 코드는 `packages/api-schema/src/apis`에 위치하며, 어드민/웹 앱에서 공통으로 사용할 수 있습니다.

## 2) 주요 명령어

```bash
# 스키마 동기화 (기본: 원격 api-docs 기준)
pnpm run sync:bruno

# 원격 강제 모드 (동일 동작을 명시적으로 실행)
pnpm --filter @solid-connect/api-schema run sync:bruno:remote

# 로컬 명세 폴더 강제 모드
BRUNO_SOURCE_MODE=local pnpm --filter @solid-connect/api-schema run sync:bruno

# 전체 빌드 시에도 자동으로 실행되도록 turbo에 연동
pnpm run build
```

## 3) 스키마 생성 흐름

1. Bruno 정의 위치(우선순위)
   - `BRUNO_COLLECTION_DIR` 환경 변수 지정 경로
   - 원격 저장소(`BRUNO_REPO_URL`) clone 후 `BRUNO_COLLECTION_PATH` 하위 경로 (기본)
   - `BRUNO_SOURCE_MODE=auto`일 때만 로컬 기본 경로(`api-docs/Solid Connection/**/*.bru`) fallback
2. 생성 명령: `bruno-api generate-hooks`
3. 생성 결과: `packages/api-schema/src/apis/**`

### 원격 동기화용 환경 변수

- `BRUNO_SOURCE_MODE`: `auto` | `local` | `remote` (기본값: `remote`)
- `BRUNO_COLLECTION_DIR`: 명세 폴더 절대/상대 경로
- `BRUNO_REPO_URL`: 원격 Bruno 저장소 URL (`remote` 모드에서 필수)
- `BRUNO_REPO_REF`: 원격 브랜치/태그 (기본값: `main`)
- `BRUNO_COLLECTION_PATH`: 저장소 내부 컬렉션 경로 (기본값: `Solid Connection`)

### 권장 환경 변수 파일

`packages/api-schema/.env`

```env
BRUNO_REPO_URL=https://github.com/solid-connection/api-docs.git
BRUNO_REPO_REF=main
BRUNO_COLLECTION_PATH="Solid Connection"
```

## 4) 파일/폴더 네이밍 규칙

`bruno-api-typescript`는 폴더/파일명 규칙에 따라 API 이름을 생성합니다.

- 폴더명: `한글 [영문키]` → 영문키 사용
- 파일명: `kebab-case.bru` 권장
- 파일명에 HTTP 메서드 포함 금지 (자동 추론)

예시:

```
7) 어드민 [Admin]/
  목록 조회 [list].bru  → adminApi.getList
```

## 5) docs 블록 작성 규칙

`docs` 블록의 **200 OK 응답 JSON**이 타입 생성의 기준이 됩니다.

```bru
docs {
  ## 200 OK
  \`\`\`json
  {
    "id": 1,
    "name": "example"
  }
  \`\`\`
}
```

### 주의사항

- 빈 배열은 `any[]`로 추론될 수 있으니, 최소 1개 요소를 포함하세요.
- `null`만 있는 값은 `null` 타입으로 고정됩니다.

## 6) 프로젝트 구성 (적용 결과)

- 공통 스키마 패키지: `packages/api-schema`
- 스키마 동기화 스크립트: `sync:bruno`
- Turbo task: `sync:bruno`

필요 시 어드민/웹에서 `packages/api-schema`를 의존성으로 추가해 사용합니다.

# 변경 이력

이 프로젝트의 모든 주요 변경사항을 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)를 기반으로 하며,
[Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따릅니다.

## [Unreleased]

### Added

#### 🎭 MSW (Mock Service Worker) 자동 생성 기능
- `.bru` 파일에서 MSW 핸들러 자동 생성
- `--msw-output` 옵션으로 MSW 핸들러 출력 디렉토리 지정
- 도메인별 MSW 핸들러 그룹화 및 index 파일 자동 생성
- `meta.done` 필드로 MSW 생성 제어
  - `done: true`: MSW 생성 건너뛰기 (백엔드 완료시)
  - `done` 없음 또는 `false`: MSW 핸들러 자동 생성

**파일 추가:**
- `src/generator/mswGenerator.ts`: MSW 핸들러 생성 로직

**사용 예시:**
```bash
npx bruno-api generate-hooks -i ./bruno -o ./src/apis --msw-output ./src/mocks
```

**생성되는 구조:**
```
src/mocks/
├── admin/
│   ├── get-list.ts
│   ├── post-create.ts
│   └── index.ts
├── users/
│   ├── get-profile.ts
│   └── index.ts
└── handlers.ts
```

#### 📁 한글 폴더명 지원
- Bruno 폴더명에서 `한글명 [EnglishKey]` 형식 지원
- 대괄호 `[]` 안의 영문 키만 추출하여 파일명 및 도메인으로 사용
- 한글 폴더명으로 가독성 확보, 영문 키로 코드 생성

**예시:**
- `사용자 [admin]/get-list.bru` → 도메인: `admin`
- `지원서 [applications]/create.bru` → 도메인: `applications`
- `상품 [products]/update.bru` → 도메인: `products`

**파일 수정:**
- `src/generator/index.ts:48-60`: extractDomain() 함수에 `[키]` 추출 로직 추가
- `src/converter/openapiConverter.ts:131-143`: extractDomain() 함수 수정
- `src/diff/changeDetector.ts:189-202`: extractDomain() 함수 수정

### Changed

#### 📝 Parser 업데이트
- `meta` 블록에 `done` 필드 추가
- `done: true` 파싱 지원

**파일 수정:**
- `src/parser/bruParser.ts:27`: ParsedBrunoFile 인터페이스에 `done?: boolean` 추가
- `src/parser/bruParser.ts:188-191`: parseMeta() 함수에 done 필드 파싱 로직 추가

#### 📚 문서 업데이트
- `docs/bruno-guide.md`: MSW 생성 제어 및 한글 폴더명 사용 가이드 추가
- `README.md`: MSW 기능 및 한글 폴더명 지원 추가
- `README.ko.md`: 한국어 문서 업데이트

### Technical Details

#### MSW 생성 로직
1. `.bru` 파일 파싱
2. `meta.done` 확인
   - `done: true`면 건너뛰기
   - 그 외의 경우 MSW 핸들러 생성
3. `docs` 블록에서 JSON 추출
4. MSW 핸들러 코드 생성
5. 도메인별 디렉토리에 파일 저장
6. 도메인별 index.ts 생성
7. 전체 handlers.ts 생성

#### 폴더명 추출 로직
```typescript
const match = folderName.match(/\[([^\]]+)\]/);
if (match) {
  return match[1]; // 대괄호 안의 키만 반환
}
return folderName; // 대괄호가 없으면 폴더명 그대로 반환
```

## [0.3.0] - 2025-01-XX

### Previous Features
- Bruno to OpenAPI conversion
- Change detection
- Changelog generation (MD/JSON/HTML)
- Breaking change identification
- CLI tool
- TypeScript type generation
- API client generation
- Typed API client generation

---

## 마이그레이션 가이드

### 기존 프로젝트용

#### 1. 한글 폴더명 사용 (선택사항)
기존 영문 폴더명을 그대로 사용하거나, 한글 폴더명으로 변경할 수 있습니다.

**변경 전:**
```
bruno/
└── applications/
    └── get-list.bru
```

**변경 후:**
```
bruno/
└── 지원서 [applications]/
    └── get-list.bru
```

생성되는 파일명은 동일합니다: `applications/useGetApplicationsList.ts`

#### 2. MSW 핸들러 생성 (선택사항)
기존 API 클라이언트 생성에 `--msw-output` 옵션을 추가하면 됩니다.

**package.json 업데이트:**
```json
{
  "scripts": {
    "api:hooks": "bruno-api generate-hooks -i ./bruno -o ./src/apis",
    "api:mocks": "bruno-api generate-hooks -i ./bruno -o ./src/apis --msw-output ./src/mocks"
  }
}
```

#### 3. 백엔드 완료된 API에 done 필드 추가 (선택사항)
이미 백엔드가 완료된 API는 `meta.done: true`를 추가하여 MSW 생성을 건너뛸 수 있습니다.

**예시:**
```bru
meta {
  name: Get User Profile
  type: http
  seq: 1
  done: true  # 백엔드 완료, MSW 불필요
}
```

---

## Contributors

- Claude Code AI Assistant

## Links

- [GitHub Repository](https://github.com/manNomi/bruno-api-typescript)
- [Documentation](./docs/)
- [Bruno Guide](./docs/bruno-guide.md)

# PRD: React Query 제거 및 타입/쿼리 동기화 강화

## 1. 배경 / 문제 정의
현재 이 레포는 Bruno `.bru` 정의를 기반으로 OpenAPI와 React Query hooks를 생성하도록 설계되어 있습니다. 목표는 **React Query 의존을 제거**하고, **타입을 확실하게 보장**하며, **쿼리(요청) 정보가 완벽히 동기화된 산출물**을 제공하는 것입니다. 즉, React Query 훅 생성이 아닌 **정확한 타입/요청 정의 생성과 변경 동기화**가 핵심 목표입니다.

## 2. 목표 (Goals)
1. **React Query 지원 제거**: 훅 생성 및 관련 문서/옵션/출력물을 제거 또는 대체.
2. **타입 정확도 강화**: Bruno docs의 JSON 예제 기반 타입 생성의 정확성을 강화하고, 불확실한 타입의 범위를 최소화.
3. **쿼리 정보 완전 동기화**: 요청 정보(메서드, URL, path/query params, request/response schema)가 항상 정확히 동기화된 산출물로 제공.

## 3. 비목표 (Non-Goals)
- 외부 클라이언트 프레임워크(React Query 외) 추가 지원은 본 범위에 포함하지 않음.
- 런타임 SDK/HTTP 클라이언트 교체는 별도 범위로 분리.

## 4. 사용자 스토리
1. 백엔드 개발자는 Bruno 파일만 수정하면 **타입과 요청 정의가 자동으로 최신화**되길 원한다.
2. 프론트엔드 개발자는 **React Query 훅 없이도** 타입과 요청 정보가 완벽히 동기화된 산출물을 받길 원한다.
3. 변경 발생 시 **동기화 상태와 변경 내역을 명확히 파악**할 수 있길 원한다.

## 5. 주요 요구사항

### 5.1 기능 요구사항
1. **React Query 훅 생성 제거**
   - `reactQueryGenerator.ts`, `queryKeyGenerator.ts`, hook 관련 CLI 옵션/문서에서 제거 또는 대체.
   - `docs/migration-guide.md`의 React Query 훅 기반 워크플로우 제거 또는 재작성.

2. **정확한 타입 산출**
   - `typeGenerator.ts`의 타입 생성 로직 검증 강화.
   - Bruno docs JSON 예제를 기반으로 **정확한 타입 선언 생성** (리터럴 → 일반 타입, 배열/객체/유니온에 대한 안정적 추론).

3. **쿼리 정보 동기화 산출물 제공**
   - 각 API 요청에 대해 **요청 메타데이터 + 타입 정보**를 함께 출력.
   - 예: `apiDefinitions.ts` (또는 유사)로 모든 API 스펙을 타입 안전하게 노출.
   - 변경 감지(캐시/디프) 결과가 이 산출물에도 적용되어 **변경 시 자동 동기화**.

### 5.2 비기능 요구사항
1. **완전 자동화**: 기존 CLI (`generate`, `generate-hooks`) 흐름에서 React Query 훅 제거 후에도 자동 생성 파이프라인이 유지되어야 함.
2. **정확성 우선**: 추론 실패 시 명확한 에러/경고 제공.
3. **호환성**: 기존 생성 파이프라인의 캐시/변경 감지 로직과 함께 동작.

## 6. 산출물 정의

### 6.1 기존 산출물 제거
- `src/apis/**` 내 React Query hooks
- `queryKeys.ts`

### 6.2 신규 산출물
1. **API 정의/타입 파일** (예: `src/apis/apiDefinitions.ts`)
   - 각 API의 메서드/경로/파라미터/응답 타입을 구조적으로 표현
   - 예시:
     ```ts
     export const ApiDefinitions = {
       users: {
         getUser: {
           method: "GET",
           path: "/users/:userId",
           params: { userId: "number" },
           response: {} as GetUserResponse,
         },
       },
     } as const;
     ```

2. **타입 정의 파일**
   - 기존 `apiClientGenerator.ts` / `apiFactoryGenerator.ts`가 제공하는 타입 산출은 유지하되, React Query 의존이 없는 형태로 재구성.

## 7. 변경 범위 (Scope)

### 7.1 제거 대상
- `src/generator/reactQueryGenerator.ts`
- `src/generator/queryKeyGenerator.ts`
- React Query 관련 문서 (README, migration-guide, querykey spec)
- CLI 명령 `generate-hooks` 혹은 해당 명령의 React Query 전용 옵션

### 7.2 수정 대상
- `src/generator/index.ts`
- `src/cli/index.ts`
- 문서/가이드: README, docs/*

### 7.3 유지 대상
- OpenAPI 생성 로직 (`openapiConverter`, `schemaBuilder`)
- 타입 생성 로직 (`typeGenerator`, `apiClientGenerator`, `apiFactoryGenerator`)
- 캐시/변경 감지 로직 (`brunoHashCache`, `changeDetector`)

## 8. 성공 기준 (Success Metrics)
1. React Query 관련 코드/문서/출력이 전부 제거되거나 대체됨.
2. 모든 API 정의가 타입 안전하게 산출됨.
3. 변경 감지/동기화 파이프라인이 정상 작동하며, 타입/정의 산출물이 최신 상태로 유지됨.

## 9. 리스크 및 대응
| 리스크 | 영향 | 대응 |
|-------|------|------|
| 기존 사용자/프론트엔드 워크플로우 영향 | 높음 | 마이그레이션 문서 제공, 레거시 출력 옵션 고려 |
| 타입 추론 정확도 한계 | 중간 | docs JSON 예제 규칙 강화, 실패 시 명확한 에러 제공 |
| 내부 CLI 변경에 따른 기존 스크립트 오류 | 중간 | 새로운 CLI 명령/옵션 명세 제공 |

## 10. 실행 계획 (Phased Plan)

### Phase 1: 구조 정리 및 React Query 제거
- React Query generator 제거
- CLI 옵션/명령 정리
- 관련 문서 제거/업데이트

### Phase 2: 타입/정의 산출물 강화
- 타입 생성 로직 보강
- API 정의 메타데이터 파일 생성
- 출력 구조 명세화

### Phase 3: 동기화 및 변경 감지 연계
- 캐시/디프/변경 감지 결과와 산출물 동기화
- 변경 리포트 문서 업데이트

### Phase 4: 문서 및 마이그레이션
- README 및 docs 전면 정비
- 기존 사용자 대상 마이그레이션 가이드 제공

## 11. 오픈 이슈
- React Query 제거 후 CLI 명령 네이밍 (`generate-hooks` 유지 여부)
- 기존 훅 기반 프론트엔드와의 호환 전략
- 타입 추론 실패 기준 및 에러 처리 정책

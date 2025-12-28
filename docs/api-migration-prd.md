# API 마이그레이션 PRD (Product Requirements Document)

## api → apis 마이그레이션 프로젝트

---

## 1. 개요

### 1.1 목적

기존 수동 작성된 `src/api` 폴더의 코드를 자동 생성된 `src/apis` 폴더 기반으로 마이그레이션하여 API 규격을 자동화된 시스템으로 통일하고, 코드 일관성과 유지보수성을 향상시킵니다.

### 1.2 배경

- 현재 API 클라이언트가 수동으로 작성되어 있어 일관성 부족
- Bruno API 스펙에서 자동 생성된 `apis` 폴더가 이미 존재
- API 스펙 변경 시 자동 동기화가 가능한 구조로 전환 필요
- 비즈니스 로직과 API 호출 로직의 분리 필요

### 1.3 범위

- **대상**: `src/api` 폴더의 모든 도메인 (13개 도메인)
- **영향받는 파일**: 약 58개 컴포넌트/파일
- **예상 기간**: 25-35시간 (도메인별 순차 진행)

### 1.4 주요 변경사항

- Import 경로 변경: `@/api/{domain}/client/*` → `@/apis/{domain}/*`
- QueryKey 구조 변경: 도메인별 독립 → 중앙 집중식 관리
- API 클라이언트: 수동 작성 → 자동 생성 기반
- 비즈니스 로직: 기존 로직 완전 보존 (리다이렉트, 토스트, 상태 관리)

---

## 2. 도메인별 마이그레이션 현황

### 2.1 도메인 목록 및 우선순위

| 우선순위 | 도메인        | 훅 수 | 컴포넌트 수 | 상태   | 예상 시간 |
| -------- | ------------- | ----- | ----------- | ------ | --------- |
| 1        | universities  | 10    | 8           | ✅완료 | 2-3시간   |
| 2        | Auth          | 8     | 10+         | 대기   | 3-4시간   |
| 3        | community     | 9     | 15+         | 대기   | 3-4시간   |
| 4        | mentor/mentee | 10    | 20+         | 대기   | 4-5시간   |
| 5        | chat          | 4     | 5+          | 대기   | 2-3시간   |
| 6        | news          | 7     | 8+          | 대기   | 2-3시간   |
| 7        | Scores        | 4     | 5+          | 대기   | 2시간     |
| 8        | MyPage        | 3     | 5+          | 대기   | 2시간     |
| 9        | applications  | 3     | 3+          | 대기   | 2시간     |
| 10       | reports       | 1     | 2+          | 대기   | 1시간     |
| 11       | file          | 1     | 2+          | 대기   | 1시간     |
| 12       | boards        | 2     | 2+          | 대기   | 1시간     |
| 13       | mentors       | 2     | 3+          | 대기   | 1시간     |

**총계**: 약 61개 훅, 90+ 컴포넌트

### 2.2 진행 상태 추적

#### universities 도메인 ✅ 완료

- [x] 분석 완료
- [x] API 클라이언트 수정 완료
- [x] 훅 마이그레이션 완료
- [x] 컴포넌트 업데이트 완료
- [x] Server-side API 처리 완료
- [x] 테스트 완료
- [x] 커밋 완료
- [x] 정리 완료 (레거시 폴더 삭제)

#### 기타 도메인 (대기 중)

- [ ] 분석 완료
- [ ] API 클라이언트 수정 완료
- [ ] 훅 마이그레이션 완료
- [ ] 컴포넌트 업데이트 완료
- [ ] Server-side API 처리 완료
- [ ] 테스트 완료
- [ ] 커밋 완료
- [ ] 정리 완료

---

## 3. 주요 변경사항

### 3.1 Import 경로 변경

**Before:**

```typescript
import { QueryKeys } from "@/api/university/client/queryKey";
import useGetUniversityDetail from "@/api/university/client/useGetUniversityDetail";
```

**After:**

```typescript
import { QueryKeys } from "@/apis/queryKeys";
import useGetUniversityDetail from "@/apis/universities/get-getUniversityDetail";
```

**통계:**

- 변경 예상 파일 수: 58개
- Import 문 변경 수: 약 100+ 개

### 3.2 QueryKey 구조 변경

**Before (도메인별 독립):**

```typescript
// api/university/client/queryKey.ts
export enum QueryKeys {
  universityDetail = "universityDetail",
  recommendedUniversity = "recommendedUniversity",
}
```

**After (중앙 집중식):**

```typescript
// apis/queryKeys.ts
export const QueryKeys = {
  universities: {
    universityDetail: "universities.universityDetail",
    recommendedUniversities: "universities.recommendedUniversities",
  },
};
```

**변경 영향:**

- QueryKey 사용처: 약 50+ 곳
- `queryClient.invalidateQueries()` 호출: 약 30+ 곳

### 3.3 비즈니스 로직 보존 현황

다음 비즈니스 로직은 100% 보존됩니다:

| 로직 유형           | 파일 수 | 보존 방법                              |
| ------------------- | ------- | -------------------------------------- |
| 리다이렉트 로직     | 7       | `onSuccess`/`onError` 콜백에 유지      |
| 토스트 메시지       | 25      | 모든 토스트 호출 유지                  |
| 상태 관리 (Zustand) | 10+     | `useAuthStore` 호출 유지               |
| 쿼리 무효화         | 30+     | `queryClient.invalidateQueries()` 유지 |
| 커스텀 다이얼로그   | 5+      | `customAlert`/`customConfirm` 유지     |

### 3.4 타입 호환성 처리

**전략:**

- 가능한 경우 `select` 옵션 사용하여 타입 변환
- 필요한 경우 타입 어설션 최소화 사용
- 기존 타입과 새 타입 매핑 테이블 작성

**예상 타입 불일치:**

- 약 10-15개 훅에서 타입 매핑 필요 예상

---

## 4. 기술적 세부사항

### 4.1 API 클라이언트 수정 내역

**현재 문제:**

- `apis/{domain}/api.ts`의 일부 URL이 `{`로 되어 있음 (자동 생성 미완료)

**수정 방법:**

- 기존 `api` 폴더의 엔드포인트 확인
- `apis/api.ts`의 URL을 실제 엔드포인트로 수정
- `publicAxiosInstance` vs `axiosInstance` 구분 확인 및 적용

**예시:**

```typescript
// Before (apis/universities/api.ts)
getUniversityDetail: async (params) => {
  const res = await axiosInstance.get(`{`, { params });
  return res.data;
};

// After
getUniversityDetail: async (universityInfoForApplyId: number) => {
  const res = await publicAxiosInstance.get(`/univ-apply-infos/${universityInfoForApplyId}`);
  return res.data;
};
```

### 4.2 비즈니스 로직 마이그레이션 패턴

#### 패턴 1: 리다이렉트 로직

```typescript
// 기존
const usePostKakaoAuth = () => {
  return useMutation({
    mutationFn: postKakaoAuth,
    onSuccess: (response) => {
      if (data.isRegistered) {
        router.replace(safeRedirect);
      } else {
        router.push(`/sign-up?token=${data.signUpToken}`);
      }
    },
  });
};

// 새로운 (apis 래핑)
import { authApi } from "./api";
const usePostKakaoAuth = () => {
  return useMutation({
    mutationFn: (data) => authApi.postKakaoAuth({ data }),
    onSuccess: (response) => {
      // 기존 비즈니스 로직 100% 유지
      if (response.isRegistered) {
        router.replace(safeRedirect);
      } else {
        router.push(`/sign-up?token=${response.signUpToken}`);
      }
    },
  });
};
```

#### 패턴 2: 토스트 + 쿼리 무효화

```typescript
// 새로운
import { QueryKeys } from "../queryKeys";
import { universitiesApi } from "./api";

// 기존
const usePostUniversityFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUniversityFavoriteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.univApplyInfosLike] });
    },
    onError: createMutationErrorHandler("위시리스트 추가에 실패했습니다."),
  });
};

const usePostAddWish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => universitiesApi.postAddWish(id),
    onSuccess: () => {
      // QueryKey 구조 변경 반영
      queryClient.invalidateQueries({ queryKey: [QueryKeys.universities.wishList] });
    },
    onError: createMutationErrorHandler("위시리스트 추가에 실패했습니다."),
  });
};
```

### 4.3 타입 매핑 전략

**전략 1: select 옵션 사용 (권장)**

```typescript
useQuery({
  queryFn: () => universitiesApi.getUniversityDetail(id),
  select: (data) => data as unknown as University, // 타입 변환
});
```

**전략 2: 타입 어설션 (최소화)**

```typescript
const data = await universitiesApi.getWishList();
return data as unknown as ListUniversity[];
```

### 4.4 Server-side API 처리 방법

**현재 구조:**

- `api/{domain}/server/*.ts`에서 `serverFetchUtil` 사용
- ISR/SSR을 위한 공개 API 호출

**마이그레이션 방법:**

```typescript
// 기존
import serverFetch from "@/utils/serverFetchUtil";
const getRecommendedUniversity = async () => {
  const res = await serverFetch<Response>(endpoint);
  return res;
};

// 새로운 (apis API를 serverFetchUtil로 래핑)
import { universitiesApi } from "@/apis/universities/api";
import serverFetch from "@/utils/serverFetchUtil";

// 옵션 1: apis API 직접 사용 (클라이언트 전용)
// 옵션 2: serverFetchUtil 래퍼 생성
const getRecommendedUniversity = async () => {
  // serverFetchUtil 사용 유지 (ISR/SSR 호환)
  const endpoint = "/univ-apply-infos/recommend";
  const res = await serverFetch<Response>(endpoint);
  return res;
};
```

**권장 접근:**

- Server-side는 기존 `serverFetchUtil` 유지
- Client-side만 `apis` 사용
- 필요시 `apis` API를 `serverFetchUtil`로 래핑

---

## 5. 영향도 분석

### 5.1 변경된 파일 수

| 카테고리         | 파일 수              |
| ---------------- | -------------------- |
| API 훅 파일      | 61개 (마이그레이션)  |
| 컴포넌트 파일    | 90+ 개 (import 변경) |
| QueryKey 파일    | 13개 (제거)          |
| Server-side 파일 | 5개 (유지 또는 래핑) |
| **총계**         | **170+ 개**          |

### 5.2 영향받는 주요 컴포넌트

**높은 영향도:**

- `src/app/university/**` - 15+ 파일
- `src/app/mentor/**` - 20+ 파일
- `src/app/community/**` - 15+ 파일
- `src/app/my/**` - 10+ 파일
- `src/app/login/**` - 5+ 파일

**중간 영향도:**

- `src/components/mentor/**` - 10+ 파일
- `src/components/**` - 15+ 파일

### 5.3 잠재적 위험 요소

| 위험 요소                               | 심각도 | 완화 전략                              |
| --------------------------------------- | ------ | -------------------------------------- |
| 타입 불일치로 인한 런타임 오류          | 높음   | 철저한 타입 검증, `select` 옵션 활용   |
| 비즈니스 로직 누락 (리다이렉트, 토스트) | 높음   | 체크리스트 작성, 코드 리뷰             |
| QueryKey 변경으로 인한 캐시 문제        | 중간   | 모든 `invalidateQueries` 호출 검증     |
| Server-side 호환성 문제                 | 중간   | ISR/SSR 테스트, `serverFetchUtil` 유지 |
| Import 경로 오류                        | 낮음   | 자동화된 검색/교체, Linter 활용        |

### 5.4 테스트 커버리지

**필수 테스트 항목:**

- [ ] 각 도메인별 기능 테스트
- [ ] 인증 플로우 테스트 (Auth 도메인)
- [ ] 리다이렉트 동작 확인
- [ ] 토스트 메시지 표시 확인
- [ ] 쿼리 캐시 무효화 확인
- [ ] 타입 오류 확인 (TypeScript)
- [ ] 빌드 테스트
- [ ] Linter 오류 확인

---

## 6. 마이그레이션 체크리스트

### 6.1 도메인별 완료 상태

각 도메인마다 다음 체크리스트를 완료해야 합니다:

#### [도메인명] 마이그레이션 체크리스트

**1단계: 분석 및 준비**

- [ ] 기존 도메인 폴더 구조 파악
- [ ] `apis` 폴더의 해당 도메인 구조 확인
- [ ] 비즈니스 로직 목록 작성
- [ ] 사용처 파악 (import 찾기)
- [ ] QueryKey 매핑 테이블 작성

**2단계: API 클라이언트 수정**

- [ ] `apis/{domain}/api.ts`의 URL 수정
- [ ] 타입 정의 확인 및 매핑
- [ ] `publicAxiosInstance` vs `axiosInstance` 구분

**3단계: 훅 마이그레이션**

- [ ] 기존 훅의 비즈니스 로직 분석
- [ ] `apis`의 기본 훅 확인
- [ ] 비즈니스 로직을 포함한 래퍼 훅 생성
- [ ] QueryKey 업데이트
- [ ] 타입 호환성 확인

**4단계: 컴포넌트 업데이트**

- [ ] 해당 도메인을 사용하는 모든 컴포넌트 찾기
- [ ] Import 경로 변경
- [ ] 타입 import 업데이트
- [ ] QueryKey 사용처 업데이트

**5단계: Server-side API 처리**

- [ ] `api/{domain}/server/*.ts` 파일 확인
- [ ] `serverFetchUtil` 사용 여부 확인
- [ ] ISR/SSR 호환성 유지
- [ ] 필요시 래퍼 함수 생성

**6단계: 테스트 및 검증**

- [ ] 기능 테스트
- [ ] 타입 오류 확인
- [ ] Linter 오류 확인
- [ ] 빌드 테스트

**7단계: 커밋**

- [ ] 모든 변경사항 스테이징
- [ ] 커밋 메시지 작성
- [ ] 커밋 완료

**8단계: 정리**

- [ ] 기존 `api/{domain}` 폴더 제거
- [ ] 사용하지 않는 import 정리
- [ ] 문서 업데이트 (필요시)

### 6.2 남은 작업 항목

**전체 진행률**: 0% (시작 전)

**다음 작업:**

1. universities 도메인 마이그레이션 시작
2. 각 단계별 검증
3. 진행 상황 기록

### 6.3 예상 완료 시점

- **시작일**: [작업 시작일]
- **예상 완료일**: [시작일 + 25-35시간]
- **도메인당 평균**: 2-4시간

---

## 7. 부록

### 7.1 도메인별 상세 변경 내역

각 도메인 마이그레이션 완료 후 다음 정보를 기록합니다:

#### [도메인명] 상세 변경 내역

**마이그레이션된 훅:**

- `useXXX` → `apis/{domain}/xxx-xxx`

**변경된 컴포넌트:**

- `src/app/...` (N개 파일)
- `src/components/...` (N개 파일)

**QueryKey 변경:**

- `QueryKeys.oldKey` → `QueryKeys.domain.newKey`

**비즈니스 로직:**

- 리다이렉트: N개 유지
- 토스트: N개 유지
- 상태 관리: N개 유지

**제거된 파일:**

- `api/{domain}/client/*.ts` (N개)
- `api/{domain}/server/*.ts` (N개, 또는 유지)

### 7.2 코드 예시 (Before/After)

#### 예시 1: 단순 Query 훅

**Before:**

```typescript
// api/university/client/useGetUniversityDetail.ts
import { publicAxiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useQuery } from "@tanstack/react-query";

const getUniversityDetail = async (id: number) => {
  const response = await publicAxiosInstance.get(`/univ-apply-infos/${id}`);
  return response.data;
};

const useGetUniversityDetail = (id: number) => {
  return useQuery({
    queryKey: [QueryKeys.universityDetail, id],
    queryFn: () => getUniversityDetail(id),
    enabled: !!id,
  });
};
```

**After:**

```typescript
// apis/universities/get-getUniversityDetail.ts
import { QueryKeys } from "../queryKeys";
import { UniversityDetailResponse, universitiesApi } from "./api";

import { University } from "@/types/university";

import { useQuery } from "@tanstack/react-query";

const useGetUniversityDetail = (id: number) => {
  return useQuery<UniversityDetailResponse, AxiosError, University>({
    queryKey: [QueryKeys.universities.universityDetail, id],
    queryFn: () => universitiesApi.getUniversityDetail(id),
    enabled: !!id,
    select: (data) => data as unknown as University,
  });
};
```

#### 예시 2: 비즈니스 로직 포함 Mutation 훅

**Before:**

```typescript
// api/auth/client/usePostKakaoAuth.ts
const usePostKakaoAuth = () => {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: postKakaoAuth,
    onSuccess: (response) => {
      const { data } = response;
      if (data.isRegistered) {
        setAccessToken(data.accessToken);
        const redirectParam = searchParams.get("redirect");
        const safeRedirect = validateSafeRedirect(redirectParam);
        toast.success("로그인에 성공했습니다.");
        router.replace(safeRedirect);
      } else {
        router.push(`/sign-up?token=${data.signUpToken}`);
      }
    },
    onError: () => {
      toast.error("카카오 로그인 중 오류가 발생했습니다.");
      router.push("/login");
    },
  });
};
```

**After:**

```typescript
// apis/Auth/post-postKakaoAuth.ts (래퍼 훅)
import { useRouter, useSearchParams } from "next/navigation";

import { validateSafeRedirect } from "@/utils/authUtils";

import { KakaoAuthResponse, authApi } from "./api";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { useMutation } from "@tanstack/react-query";

const usePostKakaoAuth = () => {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation<KakaoAuthResponse, AxiosError, { code: string }>({
    mutationFn: (data) => authApi.postKakaoAuth({ data }),
    onSuccess: (response) => {
      // 기존 비즈니스 로직 100% 유지
      if (response.isRegistered) {
        setAccessToken(response.accessToken);
        const redirectParam = searchParams.get("redirect");
        const safeRedirect = validateSafeRedirect(redirectParam);
        toast.success("로그인에 성공했습니다.");
        router.replace(safeRedirect);
      } else {
        router.push(`/sign-up?token=${response.signUpToken}`);
      }
    },
    onError: () => {
      toast.error("카카오 로그인 중 오류가 발생했습니다.");
      router.push("/login");
    },
  });
};
```

### 7.3 마이그레이션 가이드

#### 단계별 가이드

**1. 도메인 선택 및 분석**

```bash
# 1. 도메인 폴더 확인
ls src/api/{domain}/client/

# 2. 사용처 찾기
grep -r "from.*@/api/{domain}" src/

# 3. apis 폴더 확인
ls src/apis/{domain}/
```

**2. API 클라이언트 수정**

- `apis/{domain}/api.ts` 파일 열기
- URL이 `{`로 되어 있으면 기존 `api` 폴더의 엔드포인트 확인
- `publicAxiosInstance` vs `axiosInstance` 구분 확인

**3. 훅 마이그레이션**

- 기존 훅 파일 열기
- 비즈니스 로직 파악 (리다이렉트, 토스트, 상태 관리)
- `apis`의 기본 훅 확인
- 비즈니스 로직을 포함한 래퍼 훅 작성

**4. 컴포넌트 업데이트**

```bash
# Import 경로 일괄 변경 (주의: 수동 검증 필요)
find src/ -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@/api/{domain}/client/|@/apis/{domain}/|g'
```

**5. QueryKey 업데이트**

- `apis/queryKeys.ts`에서 해당 도메인 키 확인
- 모든 사용처에서 `QueryKeys.old` → `QueryKeys.domain.new` 변경

**6. 테스트**

```bash
# 타입 체크
npm run type-check

# Linter
npm run lint

# 빌드
npm run build
```

**7. 커밋**

```bash
git add .
git commit -m "refactor: migrate {domain} from api to apis

Changes:
- Migrate {N} hooks from api/{domain} to apis/{domain}
- Preserve business logic (redirects, toasts, state management)
- Update QueryKeys: {old} → {new}
- Update {N} component imports
- Remove api/{domain} folder"
```

### 7.4 커밋 메시지 템플릿

```
refactor: migrate {domain} from api to apis

Changes:
- Migrate {N} hooks from api/{domain} to apis/{domain}
- Preserve business logic (redirects, toasts, state management)
- Update QueryKeys: {old structure} → {new structure}
- Update {N} component imports
- Remove api/{domain} folder

Files changed:
- src/apis/{domain}/* (modified/created)
- src/app/**/* (imports updated)
- src/components/**/* (imports updated)
- src/api/{domain}/* (removed)

Breaking changes: None (internal refactoring)
```

### 7.5 비즈니스 로직 체크리스트

각 훅 마이그레이션 시 다음 항목을 확인:

- [ ] 리다이렉트 로직 유지 (`router.push`, `router.replace`)
- [ ] 토스트 메시지 유지 (`toast.success`, `toast.error`)
- [ ] 상태 관리 유지 (`useAuthStore`, `setAccessToken`, `clearAccessToken`)
- [ ] 쿼리 무효화 유지 (`queryClient.invalidateQueries`)
- [ ] 커스텀 다이얼로그 유지 (`customAlert`, `customConfirm`)
- [ ] 에러 핸들링 유지 (`onError` 콜백)
- [ ] 조건부 로직 유지 (`if/else` 분기)

---

## 8. 리스크 관리

### 8.1 주요 리스크 및 완화 전략

| 리스크                           | 심각도 | 확률 | 완화 전략                                                   |
| -------------------------------- | ------ | ---- | ----------------------------------------------------------- |
| 타입 불일치로 인한 런타임 오류   | 높음   | 중간 | 철저한 타입 검증, `select` 옵션 활용, 타입 매핑 테이블 작성 |
| 비즈니스 로직 누락               | 높음   | 낮음 | 체크리스트 작성, 코드 리뷰, 단계별 검증                     |
| QueryKey 변경으로 인한 캐시 문제 | 중간   | 낮음 | 모든 `invalidateQueries` 호출 검증, 테스트                  |
| Server-side 호환성 문제          | 중간   | 낮음 | ISR/SSR 테스트, `serverFetchUtil` 유지                      |
| Import 경로 오류                 | 낮음   | 낮음 | 자동화된 검색/교체, Linter 활용                             |

### 8.2 롤백 계획

각 도메인 마이그레이션 후 문제 발생 시:

1. 해당 도메인의 커밋만 롤백
2. 기존 `api/{domain}` 폴더 복원
3. Import 경로 복원
4. 문제 분석 후 재시도

---

## 9. 성공 기준

### 9.1 기능적 요구사항

- [ ] 모든 도메인 마이그레이션 완료
- [ ] 기존 기능 100% 동작 보장
- [ ] 비즈니스 로직 100% 보존
- [ ] 타입 오류 0개
- [ ] Linter 오류 0개
- [ ] 빌드 성공

### 9.2 비기능적 요구사항

- [ ] 코드 일관성 향상
- [ ] 유지보수성 향상
- [ ] API 스펙 자동 동기화 가능
- [ ] 성능 저하 없음

---

## 10. 참고 자료

### 10.1 관련 문서

- [마이그레이션 계획서](./api_마이그레이션_통합_계획.md)
- [온보딩 문서](./onboarding.md)
- [Git/CICD 가이드](./git-cicd.md)

### 10.2 관련 파일

- `src/api/` - 기존 API 폴더
- `src/apis/` - 새로운 API 폴더 (자동 생성)
- `src/apis/queryKeys.ts` - 중앙 집중식 QueryKey
- `src/utils/axiosInstance.ts` - Axios 인스턴스
- `src/utils/serverFetchUtil.ts` - Server-side fetch 유틸

---

**문서 버전**: 1.0  
**작성일**: [작성일]  
**최종 수정일**: [수정일]  
**작성자**: Development Team

# API 마이그레이션 PRD

> `src/api` → `src/apis` 완전 마이그레이션

---

## 1. 개요

### 1.1 목표

`src/api` 폴더를 완전히 제거하고 `src/apis` 폴더로 통합하여 API 레이어를 단일화한다.

### 1.2 현황

| 폴더       | 상태   | 파일 수 | 설명                         |
| ---------- | ------ | ------- | ---------------------------- |
| `src/api`  | 레거시 | 63개    | 수동 작성, 제거 대상         |
| `src/apis` | 신규   | 진행중  | Bruno 기반 자동생성 + 커스텀 |

---

## 2. 마이그레이션 대상

### 2.1 도메인별 현황

| #   | 도메인       | api 파일 | apis 존재 | 상태    | 비고 |
| --- | ------------ | -------- | --------- | ------- | ---- |
| 1   | auth         | 8        | ✅        | ⏳ 대기 |      |
| 2   | community    | 9        | ✅        | ⏳ 대기 |      |
| 3   | mentor       | 7        | ✅        | ⏳ 대기 |      |
| 4   | mentee       | 4        | ❌        | ⏳ 대기 |      |
| 5   | mentors      | 3        | ❌        | ⏳ 대기 |      |
| 6   | chat         | 5        | ✅        | ⏳ 대기 |      |
| 7   | news         | 7        | ✅        | ⏳ 대기 |      |
| 8   | score        | 5        | ✅        | ⏳ 대기 |      |
| 9   | my           | 4        | ✅        | ⏳ 대기 |      |
| 10  | applications | 4        | ✅        | ⏳ 대기 |      |
| 11  | boards       | 3        | ❌        | ⏳ 대기 |      |
| 12  | file         | 1        | ✅        | ⏳ 대기 |      |
| 13  | reports      | 1        | ✅        | ⏳ 대기 |      |

**총계**: 63개 파일 → 0개 (완전 제거)

### 2.2 상세 파일 목록

#### auth (8개)

```
src/api/auth/
├── server/
│   └── postReissueToken.ts      # 서버사이드 유지 필요
├── client/
│   ├── usePostKakaoAuth.ts
│   ├── usePostAppleAuth.ts
│   ├── usePostEmailAuth.ts
│   ├── usePostSignUp.ts
│   ├── usePostEmailSignUp.ts
│   ├── usePostLogout.ts
│   └── useDeleteUserAccount.ts
└── useLogin.ts
```

#### community (9개)

```
src/api/community/client/
├── queryKey.ts
├── useGetPostDetail.ts
├── useCreatePost.ts
├── useUpdatePost.ts
├── useDeletePost.ts
├── useCreateComment.ts
├── useDeleteComment.ts
├── usePostLike.ts
└── useDeleteLike.ts
```

#### mentor (7개)

```
src/api/mentor/client/
├── queryKey.ts
├── useGetMentorMyProfile.ts
├── usePutMyMentorProfile.ts
├── usePostMentorApplication.ts
├── useGetMentoringList.ts
├── useGetMentoringUncheckedCount.ts
├── usePatchMentorCheckMentorings.ts
└── usePatchApprovalStatus.ts
```

#### mentee (4개)

```
src/api/mentee/client/
├── queryKey.ts
├── useGetApplyMentoringList.ts
├── usePostApplyMentoring.ts
└── usePatchMenteeCheckMentorings.ts
```

#### mentors (3개)

```
src/api/mentors/client/
├── queryKey.ts
├── useGetMentorList.ts
└── useGetMentorDetail.ts
```

#### chat (5개)

```
src/api/chat/clients/
├── queryKey.ts
├── useGetChatRooms.ts
├── useGetChatHistories.ts
├── useGetPartnerInfo.ts
└── usePutChatRead.ts
```

#### news (7개)

```
src/api/news/client/
├── queryKey.ts
├── useGetArticleList.ts
├── usePostAddArticle.ts
├── usePutModifyArticle.ts
├── useDeleteArticle.ts
├── usePostArticleLike.ts
└── useDeleteArticleLike.ts
```

#### score (5개)

```
src/api/score/client/
├── queryKey.ts
├── useGetMyGpaScore.ts
├── usePostGpaScore.ts
├── useGetMyLanguageTestScore.ts
└── usePostLanguageTestScore.ts
```

#### my (4개)

```
src/api/my/client/
├── queryKey.ts
├── useGetMyInfo.ts
├── usePatchMyInfo.ts
└── usePatchMyPassword.ts
```

#### applications (4개)

```
src/api/applications/client/
├── queryKeys.ts
├── useGetApplicationsList.ts
├── usePostSubmitApplication.ts
└── useGetCompetitorsApplicationList.ts
```

#### boards (3개)

```
src/api/boards/
├── clients/
│   ├── QueryKeys.ts
│   └── useGetPostList.ts
└── server/
    └── getPostList.ts
```

#### file (1개)

```
src/api/file/client/
└── useUploadProfileImagePublic.ts
```

#### reports (1개)

```
src/api/reports/client/
└── usePostReport.ts
```

---

## 3. 마이그레이션 규칙

### 3.1 네이밍 컨벤션

| 항목     | Before (api)             | After (apis)              |
| -------- | ------------------------ | ------------------------- |
| Query 훅 | `useGetXxx.ts`           | `useGetXxx.ts` (동일)     |
| Mutation | `usePostXxx.ts`          | `usePostXxx.ts` (동일)    |
| QueryKey | `queryKey.ts` (도메인별) | `queryKeys.ts` (중앙집중) |
| API 함수 | 훅 내부 정의             | `api.ts` 에서 export      |
| Import   | `@/api/{domain}/client/` | `@/apis/{domain}/`        |

### 3.2 QueryKey 통합

**Before** (각 도메인별 분산):

```typescript
// src/api/community/client/queryKey.ts
export enum QueryKeys {
  postDetail = "postDetail",
  postList = "postList",
}
```

**After** (중앙 집중):

```typescript
// src/apis/queryKeys.ts
export const QueryKeys = {
  community: {
    postDetail: "community.postDetail",
    postList: "community.postList",
  },
  // ...
};
```

### 3.3 비즈니스 로직 보존

마이그레이션 시 다음 로직은 **반드시** 보존:

- [ ] `router.push()` / `router.replace()` 리다이렉트
- [ ] `toast.success()` / `toast.error()` 알림
- [ ] `useAuthStore` 상태 관리
- [ ] `queryClient.invalidateQueries()` 캐시 무효화
- [ ] `onSuccess` / `onError` 콜백 로직

---

## 4. 작업 체크리스트

### 4.1 도메인별 체크리스트 템플릿

```markdown
#### [도메인명] 마이그레이션

- [ ] api.ts URL/메서드 확인 및 수정
- [ ] 훅 마이그레이션 (비즈니스 로직 보존)
- [ ] QueryKey 통합
- [ ] 컴포넌트 import 경로 변경
- [ ] 서버사이드 API 처리 (해당시)
- [ ] TypeScript 에러 확인
- [ ] 기능 테스트
- [ ] 레거시 파일 삭제
```

### 4.2 전체 진행 상황

| 도메인       | 분석 | 마이그레이션 | 테스트 | 삭제 | 완료 |
| ------------ | ---- | ------------ | ------ | ---- | ---- |
| auth         | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| community    | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| mentor       | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| mentee       | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| mentors      | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| chat         | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| news         | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| score        | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| my           | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| applications | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| boards       | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| file         | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |
| reports      | ⬜   | ⬜           | ⬜     | ⬜   | ⬜   |

**범례**: ⬜ 대기 | 🔄 진행중 | ✅ 완료

---

## 5. 우선순위

### 5.1 권장 순서

1. **auth** - 인증 로직, 가장 중요
2. **my** - 내 정보, auth와 연관
3. **community** - 커뮤니티 기능
4. **mentor/mentee/mentors** - 멘토링 기능 (함께 진행)
5. **chat** - 채팅 기능
6. **news** - 뉴스/아티클
7. **score** - 성적 관리
8. **applications** - 지원 관리
9. **boards** - 게시판
10. **file** - 파일 업로드
11. **reports** - 신고 기능

### 5.2 의존성 주의사항

- `auth/server/postReissueToken.ts` → axios interceptor에서 사용
- `mentor/mentee` → QueryKey 공유 가능성 확인
- `boards/community` → 유사 기능, 통합 검토

---

## 6. 완료 조건

- [ ] `src/api` 폴더 완전 삭제
- [ ] 모든 import가 `@/apis/` 경로 사용
- [ ] TypeScript 에러 0개
- [ ] ESLint 에러 0개
- [ ] 빌드 성공
- [ ] 모든 기능 정상 동작

---

## 7. 커밋 컨벤션

```
refactor: migrate {domain} from api to apis

- Migrate {N} hooks to apis/{domain}
- Update component imports
- Remove legacy api/{domain} folder
```

---

**최종 수정일**: 2025-12-28

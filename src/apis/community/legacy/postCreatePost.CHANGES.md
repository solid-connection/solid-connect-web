# 변경사항: postCreatePost.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/posts
- Method: POST
- Function: postCreatePost

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `PostIdResponse & { boardCode: string }`
- 현재: `CreatePostResponse`

### request-type

**Request 타입 변경**

- 이전: `PostCreateRequest`
- 현재: `CreatePostRequest`

### query-key

**QueryKey 변경**

- 이전: `CommunityQueryKeys.posts`
- 현재: `QueryKeys.community.postCreatePost, URL, params`

## 권장 조치

1. `legacy/postCreatePost.ts` 파일의 비즈니스 로직 확인
2. 새 `postCreatePost.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/postCreatePost.ts` 파일 삭제
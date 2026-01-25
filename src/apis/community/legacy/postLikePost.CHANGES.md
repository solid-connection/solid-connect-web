# 변경사항: postLikePost.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/posts/{{post-id}}/like
- Method: POST
- Function: postLikePost

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `PostLikeResponse`
- 현재: `LikePostResponse`

### request-type

**Request 타입 변경**

- 이전: `number`
- 현재: `LikePostRequest`

### query-key

**QueryKey 변경**

- 이전: `CommunityQueryKeys.posts, postId`
- 현재: `QueryKeys.community.postLikePost, URL, params`

## 권장 조치

1. `legacy/postLikePost.ts` 파일의 비즈니스 로직 확인
2. 새 `postLikePost.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/postLikePost.ts` 파일 삭제
# 변경사항: postCreateComment.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/comments
- Method: POST
- Function: postCreateComment

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `CommentIdResponse`
- 현재: `CreateCommentResponse`

### request-type

**Request 타입 변경**

- 이전: `CommentCreateRequest`
- 현재: `CreateCommentRequest`

### query-key

**QueryKey 변경**

- 이전: `CommunityQueryKeys.posts, variables.postId`
- 현재: `QueryKeys.community.postCreateComment, URL, params`

## 권장 조치

1. `legacy/postCreateComment.ts` 파일의 비즈니스 로직 확인
2. 새 `postCreateComment.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/postCreateComment.ts` 파일 삭제
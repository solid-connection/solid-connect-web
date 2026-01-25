# 변경사항: deleteComment.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/comments/{{comment-id}}
- Method: DELETE
- Function: deleteComment

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `CommentIdResponse`
- 현재: `CommentResponse`

### query-key

**QueryKey 변경**

- 이전: `CommunityQueryKeys.posts, variables.postId`
- 현재: `QueryKeys.community.deleteComment, URL, params`

## 권장 조치

1. `legacy/deleteComment.ts` 파일의 비즈니스 로직 확인
2. 새 `deleteComment.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/deleteComment.ts` 파일 삭제
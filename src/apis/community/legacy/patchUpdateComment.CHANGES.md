# 변경사항: patchUpdateComment.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/comments/{{comment-id}}
- Method: PATCH
- Function: patchUpdateComment

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `CommentIdResponse`
- 현재: `UpdateCommentResponse`

### request-type

**Request 타입 변경**

- 이전: `{ commentId: number; content: string }`
- 현재: `UpdateCommentRequest`

## 권장 조치

1. `legacy/patchUpdateComment.ts` 파일의 비즈니스 로직 확인
2. 새 `patchUpdateComment.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/patchUpdateComment.ts` 파일 삭제
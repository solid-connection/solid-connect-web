# 변경사항: deletePost.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/posts/{{post-id}}
- Method: DELETE
- Function: deletePost

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `AxiosResponse<DeletePostResponse`
- 현재: `PostResponse`

### query-key

**QueryKey 변경**

- 이전: `CommunityQueryKeys.posts`
- 현재: `QueryKeys.community.deletePost, URL, params`

## 권장 조치

1. `legacy/deletePost.ts` 파일의 비즈니스 로직 확인
2. 새 `deletePost.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/deletePost.ts` 파일 삭제
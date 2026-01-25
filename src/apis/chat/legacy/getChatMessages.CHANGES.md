# 변경사항: getChatMessages.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/chats/rooms/{{room-id}}?size={{default-size}}&page={{default-page}}
- Method: GET
- Function: getChatMessages

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `ChatHistoriesResponse`
- 현재: `ChatMessagesResponse`

### query-key

**QueryKey 변경**

- 이전: `ChatQueryKeys.chatHistories, roomId`
- 현재: `QueryKeys.chat.getChatMessages, URL, params`

## 권장 조치

1. `legacy/getChatMessages.ts` 파일의 비즈니스 로직 확인
2. 새 `getChatMessages.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getChatMessages.ts` 파일 삭제
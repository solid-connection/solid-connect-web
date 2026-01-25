# 변경사항: putReadChatRoom.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/chats/rooms/{{room-id}}/read
- Method: PUT
- Function: putReadChatRoom

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `void`
- 현재: `ReadChatRoomResponse`

### request-type

**Request 타입 변경**

- 이전: `number`
- 현재: `ReadChatRoomRequest`

### query-key

**QueryKey 변경**

- 이전: `ChatQueryKeys.chatRooms`
- 현재: `QueryKeys.chat.putReadChatRoom, URL, params`

## 권장 조치

1. `legacy/putReadChatRoom.ts` 파일의 비즈니스 로직 확인
2. 새 `putReadChatRoom.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/putReadChatRoom.ts` 파일 삭제
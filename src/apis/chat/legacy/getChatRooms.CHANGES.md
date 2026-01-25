# 변경사항: getChatRooms.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/chats/rooms
- Method: GET
- Function: getChatRooms

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `ChatRoomListResponse`
- 현재: `ChatRoomsResponse`

### query-key

**QueryKey 변경**

- 이전: `ChatQueryKeys.chatRooms`
- 현재: `QueryKeys.chat.getChatRooms, URL, params`

## 권장 조치

1. `legacy/getChatRooms.ts` 파일의 비즈니스 로직 확인
2. 새 `getChatRooms.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getChatRooms.ts` 파일 삭제
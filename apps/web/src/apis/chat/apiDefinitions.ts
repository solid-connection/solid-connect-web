import type { ChatMessagesResponse, ChatPartnerResponse, ChatRoomsResponse, ReadChatRoomResponse } from './api';

export const chatApiDefinitions = {
  getChatMessages: {
    method: 'GET' as const,
    path: '{{URL}}/chats/rooms/{{room-id}}?size={{default-size}}&page={{default-page}}' as const,
    pathParams: {} as { roomId: string | number; defaultSize: string | number; defaultPage: string | number },
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as ChatMessagesResponse,
  },
  getChatRooms: {
    method: 'GET' as const,
    path: '{{URL}}/chats/rooms' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as ChatRoomsResponse,
  },
  putReadChatRoom: {
    method: 'PUT' as const,
    path: '{{URL}}//chats/rooms/{{room-id}}/read' as const,
    pathParams: {} as { roomId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as ReadChatRoomResponse,
  },
  getChatPartner: {
    method: 'GET' as const,
    path: '{{URL}}/chats/rooms/{{room-id}}/partner' as const,
    pathParams: {} as { roomId: string | number },
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as ChatPartnerResponse,
  },
} as const;

export type ChatApiDefinitions = typeof chatApiDefinitions;
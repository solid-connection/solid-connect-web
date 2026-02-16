import type { GetChatMessagesResponse, GetChatPartnerResponse, GetChatRoomsResponse, PutReadChatRoomResponse } from './api';

export const chatApiDefinitions = {
  getChatMessages: {
    method: 'GET' as const,
    path: '/chats/rooms/{{room-id}}' as const,
    pathParams: undefined as unknown as { roomId: string | number },
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetChatMessagesResponse,
  },
  getChatRooms: {
    method: 'GET' as const,
    path: '/chats/rooms' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetChatRoomsResponse,
  },
  putReadChatRoom: {
    method: 'PUT' as const,
    path: '/chats/rooms/{{room-id}}/read' as const,
    pathParams: undefined as unknown as { roomId: string | number },
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PutReadChatRoomResponse,
  },
  getChatPartner: {
    method: 'GET' as const,
    path: '/chats/rooms/{{room-id}}/partner' as const,
    pathParams: undefined as unknown as { roomId: string | number },
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetChatPartnerResponse,
  },
} as const;

export type ChatApiDefinitions = typeof chatApiDefinitions;
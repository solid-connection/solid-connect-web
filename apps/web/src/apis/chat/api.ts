import type { AxiosResponse } from "axios";
import type { ChatMessage, ChatPartner, ChatRoom } from "@/types/chat";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  normalizeChatPartner,
  normalizeChatRoom,
  parseChatMessage,
  type RawChatPartner,
  type RawChatRoom,
} from "./normalize";

// Re-export types from @/types/chat
export type { ChatMessage, ChatRoom, ChatPartner };

export interface ChatHistoriesResponse {
  nextPageNumber: number; // 다음 페이지가 없다면 -1
  content: ChatMessage[];
}

export interface ChatRoomListResponse {
  chatRooms: ChatRoom[];
}

interface GetChatHistoriesParams {
  roomId: number;
  size?: number;
  page?: number;
  signal?: AbortSignal;
}

interface RawChatHistoriesResponse {
  nextPageNumber: number;
  content: unknown[];
}

interface RawChatRoomListResponse {
  chatRooms: RawChatRoom[];
}

export const chatApi = {
  getChatHistories: async ({
    roomId,
    size = 20,
    page = 1,
    signal,
  }: GetChatHistoriesParams): Promise<ChatHistoriesResponse> => {
    const res = await axiosInstance.get<RawChatHistoriesResponse>(`/chats/rooms/${roomId}`, {
      params: {
        size,
        page,
      },
      signal,
    });
    const nextPageNumber = res.data?.nextPageNumber;
    if (
      !Array.isArray(res.data?.content) ||
      (nextPageNumber !== -1 && (!Number.isSafeInteger(nextPageNumber) || nextPageNumber <= page))
    ) {
      throw new Error("채팅 내역 응답이 올바르지 않습니다.");
    }

    const content: ChatMessage[] = [];
    for (const rawMessage of res.data.content) {
      const message = parseChatMessage(rawMessage);
      if (!message) throw new Error("채팅 내역에 올바르지 않은 메시지가 있습니다.");
      content.push(message);
    }

    return { nextPageNumber, content };
  },

  getChatRooms: async (signal?: AbortSignal): Promise<ChatRoomListResponse> => {
    const res = await axiosInstance.get<RawChatRoomListResponse>("/chats/rooms", { signal });
    return {
      chatRooms: (res.data.chatRooms ?? []).map(normalizeChatRoom),
    };
  },

  putReadChatRoom: async (roomId: number, signal?: AbortSignal): Promise<void> => {
    const response: AxiosResponse<void> = await axiosInstance.put(`/chats/rooms/${roomId}/read`, undefined, { signal });
    return response.data;
  },

  getChatPartner: async (roomId: number, signal?: AbortSignal): Promise<ChatPartner> => {
    const res = await axiosInstance.get<RawChatPartner>(`/chats/rooms/${roomId}/partner`, { signal });
    return normalizeChatPartner(res.data);
  },
};

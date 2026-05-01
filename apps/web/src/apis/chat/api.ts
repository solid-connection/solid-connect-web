import type { AxiosResponse } from "axios";
import type { ChatMessage, ChatPartner, ChatRoom } from "@/types/chat";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  normalizeChatMessage,
  normalizeChatPartner,
  normalizeChatRoom,
  type RawChatMessage,
  type RawChatPartner,
  type RawChatRoom,
} from "./normalize";

// QueryKeys for chat domain
export const ChatQueryKeys = {
  chatRooms: "chatRooms",
  chatHistories: "chatHistories",
  partnerInfo: "partnerInfo",
} as const;

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
}

interface RawChatHistoriesResponse {
  nextPageNumber: number;
  content: RawChatMessage[];
}

interface RawChatRoomListResponse {
  chatRooms: RawChatRoom[];
}

export const chatApi = {
  getChatHistories: async ({ roomId, size = 20, page = 0 }: GetChatHistoriesParams): Promise<ChatHistoriesResponse> => {
    const res = await axiosInstance.get<RawChatHistoriesResponse>(`/chats/rooms/${roomId}`, {
      params: {
        size,
        page,
      },
    });
    return {
      nextPageNumber: res.data.nextPageNumber,
      content: (res.data.content ?? []).map(normalizeChatMessage),
    };
  },

  getChatRooms: async (): Promise<ChatRoomListResponse> => {
    const res = await axiosInstance.get<RawChatRoomListResponse>("/chats/rooms");
    return {
      chatRooms: (res.data.chatRooms ?? []).map(normalizeChatRoom),
    };
  },

  putReadChatRoom: async (roomId: number): Promise<void> => {
    const response: AxiosResponse<void> = await axiosInstance.put(`/chats/rooms/${roomId}/read`);
    return response.data;
  },

  getChatPartner: async (roomId: number): Promise<ChatPartner> => {
    const res = await axiosInstance.get<RawChatPartner>(`/chats/rooms/${roomId}/partner`);
    return normalizeChatPartner(res.data);
  },
};

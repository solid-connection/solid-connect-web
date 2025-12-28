import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { ChatMessage, ChatPartner, ChatRoom } from "@/types/chat";

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

export const chatApi = {
  getChatHistories: async ({ roomId, size = 20, page = 0 }: GetChatHistoriesParams): Promise<ChatHistoriesResponse> => {
    const res = await axiosInstance.get<ChatHistoriesResponse>(`/chats/rooms/${roomId}`, {
      params: {
        size,
        page,
      },
    });
    return res.data;
  },

  getChatRooms: async (): Promise<ChatRoomListResponse> => {
    const res = await axiosInstance.get<ChatRoomListResponse>("/chats/rooms");
    return res.data;
  },

  putReadChatRoom: async (roomId: number): Promise<void> => {
    const response: AxiosResponse<void> = await axiosInstance.put(`/chats/rooms/${roomId}/read`);
    return response.data;
  },

  getChatPartner: async (roomId: number): Promise<ChatPartner> => {
    const res = await axiosInstance.get<ChatPartner>(`/chats/rooms/${roomId}/partner`);
    return res.data;
  },
};

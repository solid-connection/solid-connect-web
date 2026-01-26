import { axiosInstance } from "@/utils/axiosInstance";

export interface ChatMessagesResponseContentItem {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  attachments: ChatMessagesResponseContentItemAttachmentsItem[];
}

export interface ChatMessagesResponseContentItemAttachmentsItem {
  id: number;
  isImage: boolean;
  url: string;
  thumbnailUrl: string | null;
  createdAt: string;
}

export interface ChatMessagesResponse {
  nextPageNumber: number;
  content: ChatMessagesResponseContentItem[];
}

export type ChatRoomsResponse = void;

export type ReadChatRoomResponse = void;

export type ReadChatRoomRequest = Record<string, never>;

export interface ChatPartnerResponse {
  partnerId: number;
  nickname: string;
  profileUrl: string;
}

export const chatApi = {
  getChatMessages: async (params: { roomId: string | number, defaultSize: string | number, defaultPage: string | number, params?: Record<string, any> }): Promise<ChatMessagesResponse> => {
    const res = await axiosInstance.get<ChatMessagesResponse>(
      `/chats/rooms/${params.roomId}?size=${params.defaultSize}&page=${params.defaultPage}`, { params: params?.params }
    );
    return res.data;
  },

  getChatRooms: async (params: { params?: Record<string, any> }): Promise<ChatRoomsResponse> => {
    const res = await axiosInstance.get<ChatRoomsResponse>(
      `/chats/rooms`, { params: params?.params }
    );
    return res.data;
  },

  putReadChatRoom: async (params: { roomId: string | number, data?: ReadChatRoomRequest }): Promise<ReadChatRoomResponse> => {
    const res = await axiosInstance.put<ReadChatRoomResponse>(
      `/chats/rooms/${params.roomId}/read`, params?.data
    );
    return res.data;
  },

  getChatPartner: async (params: { roomId: string | number, params?: Record<string, any> }): Promise<ChatPartnerResponse> => {
    const res = await axiosInstance.get<ChatPartnerResponse>(
      `/chats/rooms/${params.roomId}/partner`, { params: params?.params }
    );
    return res.data;
  },

};
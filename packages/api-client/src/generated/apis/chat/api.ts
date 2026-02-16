import { axiosInstance } from "../../../runtime/axiosInstance";

export interface GetChatMessagesResponseContentItem {
  id: number;
  content: string;
  siteUserId: number;
  createdAt: string;
  attachments: GetChatMessagesResponseContentItemAttachmentsItem[];
}

export interface GetChatMessagesResponseContentItemAttachmentsItem {
  id: number;
  isImage: boolean;
  url: string;
  thumbnailUrl: string | null;
  createdAt: string;
}

export interface GetChatMessagesResponse {
  nextPageNumber: number;
  content: GetChatMessagesResponseContentItem[];
}

export type GetChatRoomsResponse = void;

export type PutReadChatRoomResponse = void;

export type PutReadChatRoomRequest = Record<string, never>;

export interface GetChatPartnerResponse {
  siteUserId: number;
  nickname: string;
  profileUrl: string;
}

export const chatApi = {
  getChatMessages: async (params: { roomId: string | number, params?: Record<string, unknown> }): Promise<GetChatMessagesResponse> => {
    const res = await axiosInstance.get<GetChatMessagesResponse>(
      `/chats/rooms/${params.roomId}`, { params: params?.params }
    );
    return res.data;
  },

  getChatRooms: async (params: { params?: Record<string, unknown> }): Promise<GetChatRoomsResponse> => {
    const res = await axiosInstance.get<GetChatRoomsResponse>(
      `/chats/rooms`, { params: params?.params }
    );
    return res.data;
  },

  putReadChatRoom: async (params: { roomId: string | number, data?: PutReadChatRoomRequest }): Promise<PutReadChatRoomResponse> => {
    const res = await axiosInstance.put<PutReadChatRoomResponse>(
      `/chats/rooms/${params.roomId}/read`, params?.data
    );
    return res.data;
  },

  getChatPartner: async (params: { roomId: string | number, params?: Record<string, unknown> }): Promise<GetChatPartnerResponse> => {
    const res = await axiosInstance.get<GetChatPartnerResponse>(
      `/chats/rooms/${params.roomId}/partner`, { params: params?.params }
    );
    return res.data;
  },

};
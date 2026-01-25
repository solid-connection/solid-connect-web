import { axiosInstance } from "@/utils/axiosInstance";

export type 채팅 내역 조회Response = void;

export type 채팅방 목록 조회Response = void;

export type 채팅방 읽음 처리Response = void;

export type 채팅방 읽음 처리Request = Record<string, never>;

export interface 채팅방 파트너 조회Response {
  partnerId: number;
  nickname: string;
  profileUrl: string;
}

export const 11) 채팅 chatApi = {
  get채팅 내역 조회: async (params: { roomId: string | number, defaultSize: string | number, defaultPage: string | number, params?: Record<string, any> }): Promise<채팅 내역 조회Response> => {
    const res = await axiosInstance.get<채팅 내역 조회Response>(
      `/chats/rooms/${params.roomId}?size=${params.defaultSize}&page=${params.defaultPage}`, { params: params?.params }
    );
    return res.data;
  },

  get채팅방 목록 조회: async (params: { params?: Record<string, any> }): Promise<채팅방 목록 조회Response> => {
    const res = await axiosInstance.get<채팅방 목록 조회Response>(
      `/chats/rooms`, { params: params?.params }
    );
    return res.data;
  },

  put채팅방 읽음 처리: async (params: { roomId: string | number, data?: 채팅방 읽음 처리Request }): Promise<채팅방 읽음 처리Response> => {
    const res = await axiosInstance.put<채팅방 읽음 처리Response>(
      `/chats/rooms/${params.roomId}/read`, params?.data
    );
    return res.data;
  },

  get채팅방 파트너 조회: async (params: { roomId: string | number, params?: Record<string, any> }): Promise<채팅방 파트너 조회Response> => {
    const res = await axiosInstance.get<채팅방 파트너 조회Response>(
      `/chats/rooms/${params.roomId}/partner`, { params: params?.params }
    );
    return res.data;
  },

};
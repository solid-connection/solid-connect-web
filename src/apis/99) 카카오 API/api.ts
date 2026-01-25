import { axiosInstance } from "@/utils/axiosInstance";

export type 사용자 id 목록 조회Response = void;

export type 연결 끊기Response = void;

export type 연결 끊기Request = Record<string, never>;

export type 정보 조회Response = void;

export const 99) 카카오 APIApi = {
  get사용자 id 목록 조회: async (params: { params?: Record<string, any> }): Promise<사용자 id 목록 조회Response> => {
    const res = await axiosInstance.get<사용자 id 목록 조회Response>(
      `https://kapi.kakao.com/v1/user/ids?order=dsc`, { params: params?.params }
    );
    return res.data;
  },

  post연결 끊기: async (params: { data?: 연결 끊기Request }): Promise<연결 끊기Response> => {
    const res = await axiosInstance.post<연결 끊기Response>(
      `https://kapi.kakao.com/v1/user/unlink?target_id_type=user_id&target_id=3715136239`, params?.data
    );
    return res.data;
  },

  get정보 조회: async (params: { params?: Record<string, any> }): Promise<정보 조회Response> => {
    const res = await axiosInstance.get<정보 조회Response>(
      `https://kapi.kakao.com/v2/user/me?property_keys=["kakao_account.email"]&target_id_type=user_id&target_id=3715136239`, { params: params?.params }
    );
    return res.data;
  },

};
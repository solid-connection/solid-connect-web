import { axiosInstance } from "@/utils/axiosInstance";

export type 닉네임 중복 검증Response = void;

export type 유저 차단 취소Response = void;

export type 유저 차단Response = void;

export type 유저 차단Request = Record<string, never>;

export interface 차단한 유저 목록 조회ResponseContentItem {
  id: number;
  blockedId: number;
  nickname: string;
  createdAt: string;
}

export interface 차단한 유저 목록 조회Response {
  content: 차단한 유저 목록 조회ResponseContentItem[];
  nextPageNumber: number;
}

export const 8) 사용자Api = {
  get닉네임 중복 검증: async (params: { params?: Record<string, any> }): Promise<닉네임 중복 검증Response> => {
    const res = await axiosInstance.get<닉네임 중복 검증Response>(
      `/users/exists?nickname=abc`, { params: params?.params }
    );
    return res.data;
  },

  delete유저 차단 취소: async (params: { blockedId: string | number }): Promise<유저 차단 취소Response> => {
    const res = await axiosInstance.delete<유저 차단 취소Response>(
      `/users/block/${params.blockedId}`
    );
    return res.data;
  },

  post유저 차단: async (params: { blockedId: string | number, data?: 유저 차단Request }): Promise<유저 차단Response> => {
    const res = await axiosInstance.post<유저 차단Response>(
      `/users/block/${params.blockedId}`, params?.data
    );
    return res.data;
  },

  get차단한 유저 목록 조회: async (params: { params?: Record<string, any> }): Promise<차단한 유저 목록 조회Response> => {
    const res = await axiosInstance.get<차단한 유저 목록 조회Response>(
      `/users/blocks`, { params: params?.params }
    );
    return res.data;
  },

};
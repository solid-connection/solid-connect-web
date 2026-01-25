import { axiosInstance } from "@/utils/axiosInstance";

export type 신고하기Response = void;

export type 신고하기Request = Record<string, never>;

export const 11) 신고Api = {
  post신고하기: async (params: { data?: 신고하기Request }): Promise<신고하기Response> => {
    const res = await axiosInstance.post<신고하기Response>(
      `/reports`, params?.data
    );
    return res.data;
  },

};
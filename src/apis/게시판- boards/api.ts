import { axiosInstance } from "@/utils/axiosInstance";

export type 게시판 목록 조회Response = void;

export type 게시판 조회Response = void;

export const 게시판 boardsApi = {
  get게시판 목록 조회: async (params: { params?: Record<string, any> }): Promise<게시판 목록 조회Response> => {
    const res = await axiosInstance.get<게시판 목록 조회Response>(
      `/boards`, { params: params?.params }
    );
    return res.data;
  },

  get게시판 조회: async (params: { boardCode: string | number, params?: Record<string, any> }): Promise<게시판 조회Response> => {
    const res = await axiosInstance.get<게시판 조회Response>(
      `/boards/${params.boardCode}`, { params: params?.params }
    );
    return res.data;
  },

};
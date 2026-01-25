import { axiosInstance } from "@/utils/axiosInstance";

export type 어학 성적 등록Response = void;

export type 어학 성적 등록Request = Record<string, never>;

export type 어학 성적 조회Response = void;

export type 학점 등록Response = void;

export type 학점 등록Request = Record<string, never>;

export type 학점 조회Response = void;

export const 6) 성적 등록Api = {
  post어학 성적 등록: async (params: { data?: 어학 성적 등록Request }): Promise<어학 성적 등록Response> => {
    const res = await axiosInstance.post<어학 성적 등록Response>(
      `/scores/language-tests`, params?.data
    );
    return res.data;
  },

  get어학 성적 조회: async (params: { params?: Record<string, any> }): Promise<어학 성적 조회Response> => {
    const res = await axiosInstance.get<어학 성적 조회Response>(
      `/scores/language-tests`, { params: params?.params }
    );
    return res.data;
  },

  post학점 등록: async (params: { data?: 학점 등록Request }): Promise<학점 등록Response> => {
    const res = await axiosInstance.post<학점 등록Response>(
      `/scores/gpas`, params?.data
    );
    return res.data;
  },

  get학점 조회: async (params: { params?: Record<string, any> }): Promise<학점 조회Response> => {
    const res = await axiosInstance.get<학점 조회Response>(
      `/scores/gpas`, { params: params?.params }
    );
    return res.data;
  },

};
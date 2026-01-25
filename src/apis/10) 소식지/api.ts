import { axiosInstance } from "@/utils/axiosInstance";

export type 소식지 목록 조회Response = void;

export type 소식지 삭제Response = void;

export type 소식지 수정Response = void;

export type 소식지 수정Request = Record<string, never>;

export type 소식지 좋아요 삭제Response = void;

export type 소식지 좋아요 추가Response = void;

export type 소식지 좋아요 추가Request = Record<string, never>;

export type 소식지 추가Response = void;

export type 소식지 추가Request = Record<string, never>;

export const 10) 소식지Api = {
  get소식지 목록 조회: async (params: { params?: Record<string, any> }): Promise<소식지 목록 조회Response> => {
    const res = await axiosInstance.get<소식지 목록 조회Response>(
      `/news?author-id=6`, { params: params?.params }
    );
    return res.data;
  },

  delete소식지 삭제: async (params: { newsId: string | number }): Promise<소식지 삭제Response> => {
    const res = await axiosInstance.delete<소식지 삭제Response>(
      `/news/${params.newsId}`
    );
    return res.data;
  },

  put소식지 수정: async (params: { newsId: string | number, data?: 소식지 수정Request }): Promise<소식지 수정Response> => {
    const res = await axiosInstance.put<소식지 수정Response>(
      `/news/${params.newsId}`, params?.data
    );
    return res.data;
  },

  delete소식지 좋아요 삭제: async (params: { newsId: string | number }): Promise<소식지 좋아요 삭제Response> => {
    const res = await axiosInstance.delete<소식지 좋아요 삭제Response>(
      `/news/${params.newsId}/like`
    );
    return res.data;
  },

  post소식지 좋아요 추가: async (params: { newsId: string | number, data?: 소식지 좋아요 추가Request }): Promise<소식지 좋아요 추가Response> => {
    const res = await axiosInstance.post<소식지 좋아요 추가Response>(
      `/news/${params.newsId}/like`, params?.data
    );
    return res.data;
  },

  post소식지 추가: async (params: { data?: 소식지 추가Request }): Promise<소식지 추가Response> => {
    const res = await axiosInstance.post<소식지 추가Response>(
      `/news`, params?.data
    );
    return res.data;
  },

};
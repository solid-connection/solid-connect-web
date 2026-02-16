import { axiosInstance } from "../../../runtime/axiosInstance";

export interface GetNewsListResponseNewsResponseListItem {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  updatedAt: string;
}

export interface GetNewsListResponse {
  newsResponseList: GetNewsListResponseNewsResponseListItem[];
}

export interface DeleteNewsResponse {
  id: number;
}

export interface PutUpdateNewsResponse {
  id: number;
}

export type PutUpdateNewsRequest = Record<string, never>;

export type PostLikeNewsResponse = void;

export type PostLikeNewsRequest = Record<string, never>;

export type DeleteLikeNewsResponse = void;

export interface PostCreateNewsResponse {
  id: number;
}

export type PostCreateNewsRequest = Record<string, never>;

export const newsApi = {
  getNewsList: async (params: { params?: Record<string, unknown> }): Promise<GetNewsListResponse> => {
    const res = await axiosInstance.get<GetNewsListResponse>(
      `/news`, { params: params?.params }
    );
    return res.data;
  },

  deleteNews: async (params: { newsId: string | number }): Promise<DeleteNewsResponse> => {
    const res = await axiosInstance.delete<DeleteNewsResponse>(
      `/news/${params.newsId}`
    );
    return res.data;
  },

  putUpdateNews: async (params: { newsId: string | number, data?: PutUpdateNewsRequest }): Promise<PutUpdateNewsResponse> => {
    const res = await axiosInstance.put<PutUpdateNewsResponse>(
      `/news/${params.newsId}`, params?.data
    );
    return res.data;
  },

  postLikeNews: async (params: { newsId: string | number, data?: PostLikeNewsRequest }): Promise<PostLikeNewsResponse> => {
    const res = await axiosInstance.post<PostLikeNewsResponse>(
      `/news/${params.newsId}/like`, params?.data
    );
    return res.data;
  },

  deleteLikeNews: async (params: { newsId: string | number }): Promise<DeleteLikeNewsResponse> => {
    const res = await axiosInstance.delete<DeleteLikeNewsResponse>(
      `/news/${params.newsId}/like`
    );
    return res.data;
  },

  postCreateNews: async (params: { data?: PostCreateNewsRequest }): Promise<PostCreateNewsResponse> => {
    const res = await axiosInstance.post<PostCreateNewsResponse>(
      `/news`, params?.data
    );
    return res.data;
  },

};
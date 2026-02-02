import { axiosInstance } from "@/utils/axiosInstance";

export interface NewsListResponseNewsResponseListItem {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  updatedAt: string;
}

export interface NewsListResponse {
  newsResponseList: NewsListResponseNewsResponseListItem[];
}

export interface NewsResponse {
  id: number;
}

export interface UpdateNewsResponse {
  id: number;
}

export type UpdateNewsRequest = Record<string, never>;

export type LikeNewsResponse = void;

export type LikeNewsRequest = Record<string, never>;

export interface CreateNewsResponse {
  id: number;
}

export type CreateNewsRequest = Record<string, never>;

export const newsApi = {
  getNewsList: async (params: { params?: Record<string, unknown> }): Promise<NewsListResponse> => {
    const res = await axiosInstance.get<NewsListResponse>(
      `/news?author-id=6`, { params: params?.params }
    );
    return res.data;
  },

  deleteNews: async (params: { newsId: string | number }): Promise<NewsResponse> => {
    const res = await axiosInstance.delete<NewsResponse>(
      `/news/${params.newsId}`
    );
    return res.data;
  },

  putUpdateNews: async (params: { newsId: string | number, data?: UpdateNewsRequest }): Promise<UpdateNewsResponse> => {
    const res = await axiosInstance.put<UpdateNewsResponse>(
      `/news/${params.newsId}`, params?.data
    );
    return res.data;
  },

  postLikeNews: async (params: { newsId: string | number, data?: LikeNewsRequest }): Promise<LikeNewsResponse> => {
    const res = await axiosInstance.post<LikeNewsResponse>(
      `/news/${params.newsId}/like`, params?.data
    );
    return res.data;
  },

  deleteLikeNews: async (params: { newsId: string | number }): Promise<LikeNewsResponse> => {
    const res = await axiosInstance.delete<LikeNewsResponse>(
      `/news/${params.newsId}/like`
    );
    return res.data;
  },

  postCreateNews: async (params: { data?: CreateNewsRequest }): Promise<CreateNewsResponse> => {
    const res = await axiosInstance.post<CreateNewsResponse>(
      `/news`, params?.data
    );
    return res.data;
  },

};
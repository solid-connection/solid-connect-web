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

export type DeleteNewsRequest = Record<string, never>;

export interface PutUpdateNewsResponse {
  id: number;
}

export type PutUpdateNewsRequest = Record<string, never>;

export type PostLikeNewsResponse = void;

export type PostLikeNewsRequest = Record<string, never>;

export type DeleteLikeNewsResponse = void;

export type DeleteLikeNewsRequest = Record<string, never>;

export interface PostCreateNewsResponse {
  id: number;
}

export type PostCreateNewsRequest = Record<string, never>;

export const newsApi = {
  getNewsList: async (params: { params?: Record<string, unknown> }): Promise<GetNewsListResponse> => {
    const res = await axiosInstance.request<GetNewsListResponse>({
      url: `/news`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  deleteNews: async (params: { newsId: string | number, data?: DeleteNewsRequest }): Promise<DeleteNewsResponse> => {
    const res = await axiosInstance.request<DeleteNewsResponse>({
      url: `/news/${params.newsId}`,
      method: "DELETE",
      data: params?.data,
    });
    return res.data;
  },

  putUpdateNews: async (params: { newsId: string | number, data?: PutUpdateNewsRequest }): Promise<PutUpdateNewsResponse> => {
    const res = await axiosInstance.request<PutUpdateNewsResponse>({
      url: `/news/${params.newsId}`,
      method: "PUT",
      data: params?.data,
    });
    return res.data;
  },

  postLikeNews: async (params: { newsId: string | number, data?: PostLikeNewsRequest }): Promise<PostLikeNewsResponse> => {
    const res = await axiosInstance.request<PostLikeNewsResponse>({
      url: `/news/${params.newsId}/like`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  deleteLikeNews: async (params: { newsId: string | number, data?: DeleteLikeNewsRequest }): Promise<DeleteLikeNewsResponse> => {
    const res = await axiosInstance.request<DeleteLikeNewsResponse>({
      url: `/news/${params.newsId}/like`,
      method: "DELETE",
      data: params?.data,
    });
    return res.data;
  },

  postCreateNews: async (params: { data?: PostCreateNewsRequest }): Promise<PostCreateNewsResponse> => {
    const res = await axiosInstance.request<PostCreateNewsResponse>({
      url: `/news`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

};
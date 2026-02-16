import { axiosInstance } from "../../../runtime/axiosInstance";

export type GetBoardListResponse = string[];

export interface GetBoardResponseItem {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  postCategory: string;
  postThumbnailUrl: null | string;
}

export type GetBoardResponse = GetBoardResponseItem[];

export interface DeleteCommentResponse {
  id: number;
}

export interface PatchUpdateCommentResponse {
  id: number;
}

export type PatchUpdateCommentRequest = Record<string, never>;

export interface PostCreateCommentResponse {
  id: number;
}

export type PostCreateCommentRequest = Record<string, never>;

export interface DeletePostResponse {
  id: number;
}

export interface PatchUpdatePostResponse {
  id: number;
}

export type PatchUpdatePostRequest = Record<string, never>;

export interface PostCreatePostResponse {
  id: number;
}

export type PostCreatePostRequest = Record<string, never>;

export interface GetPostDetailResponsePostFindPostImageResponsesItem {
  id: number;
  imageUrl: string;
}

export interface GetPostDetailResponsePostFindCommentResponsesItem {
  id: number;
  parentId: null | number;
  content: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  postFindSiteUserResponse: GetPostDetailResponsePostFindCommentResponsesItemPostFindSiteUserResponse;
}

export interface GetPostDetailResponsePostFindCommentResponsesItemPostFindSiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface GetPostDetailResponsePostFindSiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface GetPostDetailResponsePostFindBoardResponse {
  code: string;
  koreanName: string;
}

export interface GetPostDetailResponse {
  id: number;
  title: string;
  content: string;
  isQuestion: boolean;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  postCategory: string;
  isOwner: boolean;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  postFindBoardResponse: GetPostDetailResponsePostFindBoardResponse;
  postFindSiteUserResponse: GetPostDetailResponsePostFindSiteUserResponse;
  postFindCommentResponses: GetPostDetailResponsePostFindCommentResponsesItem[];
  postFindPostImageResponses: GetPostDetailResponsePostFindPostImageResponsesItem[];
}

export interface PostLikePostResponse {
  likeCount: number;
  isLiked: boolean;
}

export type PostLikePostRequest = Record<string, never>;

export interface DeleteLikePostResponse {
  likeCount: number;
  isLiked: boolean;
}

export const communityApi = {
  getBoardList: async (params: { params?: Record<string, unknown> }): Promise<GetBoardListResponse> => {
    const res = await axiosInstance.get<GetBoardListResponse>(
      `/boards`, { params: params?.params }
    );
    return res.data;
  },

  getBoard: async (params: { boardCode: string | number, params?: Record<string, unknown> }): Promise<GetBoardResponse> => {
    const res = await axiosInstance.get<GetBoardResponse>(
      `/boards/${params.boardCode}`, { params: params?.params }
    );
    return res.data;
  },

  deleteComment: async (params: { commentId: string | number }): Promise<DeleteCommentResponse> => {
    const res = await axiosInstance.delete<DeleteCommentResponse>(
      `/comments/${params.commentId}`
    );
    return res.data;
  },

  patchUpdateComment: async (params: { commentId: string | number, data?: PatchUpdateCommentRequest }): Promise<PatchUpdateCommentResponse> => {
    const res = await axiosInstance.patch<PatchUpdateCommentResponse>(
      `/comments/${params.commentId}`, params?.data
    );
    return res.data;
  },

  postCreateComment: async (params: { data?: PostCreateCommentRequest }): Promise<PostCreateCommentResponse> => {
    const res = await axiosInstance.post<PostCreateCommentResponse>(
      `/comments`, params?.data
    );
    return res.data;
  },

  deletePost: async (params: { postId: string | number }): Promise<DeletePostResponse> => {
    const res = await axiosInstance.delete<DeletePostResponse>(
      `/posts/${params.postId}`
    );
    return res.data;
  },

  patchUpdatePost: async (params: { postId: string | number, data?: PatchUpdatePostRequest }): Promise<PatchUpdatePostResponse> => {
    const res = await axiosInstance.patch<PatchUpdatePostResponse>(
      `/posts/${params.postId}`, params?.data
    );
    return res.data;
  },

  postCreatePost: async (params: { data?: PostCreatePostRequest }): Promise<PostCreatePostResponse> => {
    const res = await axiosInstance.post<PostCreatePostResponse>(
      `/posts`, params?.data
    );
    return res.data;
  },

  getPostDetail: async (params: { postId: string | number, params?: Record<string, unknown> }): Promise<GetPostDetailResponse> => {
    const res = await axiosInstance.get<GetPostDetailResponse>(
      `/posts/${params.postId}`, { params: params?.params }
    );
    return res.data;
  },

  postLikePost: async (params: { postId: string | number, data?: PostLikePostRequest }): Promise<PostLikePostResponse> => {
    const res = await axiosInstance.post<PostLikePostResponse>(
      `/posts/${params.postId}/like`, params?.data
    );
    return res.data;
  },

  deleteLikePost: async (params: { postId: string | number }): Promise<DeleteLikePostResponse> => {
    const res = await axiosInstance.delete<DeleteLikePostResponse>(
      `/posts/${params.postId}/like`
    );
    return res.data;
  },

};
import { axiosInstance } from "@/utils/axiosInstance";

export interface BoardListResponse {
  0: string;
  1: string;
  2: string;
  3: string;
}

export interface BoardResponseItem {
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

export interface BoardResponse {
  0: BoardResponse0;
  1: BoardResponse1;
  2: BoardResponse2;
  3: BoardResponse3;
}

export interface CommentResponse {
  id: number;
}

export interface UpdateCommentResponse {
  id: number;
}

export type UpdateCommentRequest = Record<string, never>;

export interface CreateCommentResponse {
  id: number;
}

export type CreateCommentRequest = Record<string, never>;

export interface PostResponse {
  id: number;
}

export interface UpdatePostResponse {
  id: number;
}

export type UpdatePostRequest = Record<string, never>;

export interface CreatePostResponse {
  id: number;
}

export type CreatePostRequest = Record<string, never>;

export interface PostDetailResponsePostFindPostImageResponsesItem {
  id: number;
  imageUrl: string;
}

export interface PostDetailResponsePostFindCommentResponsesItem {
  id: number;
  parentId: null | number;
  content: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  postFindSiteUserResponse: PostDetailResponsePostFindCommentResponsesItemPostFindSiteUserResponse;
}

export interface PostDetailResponsePostFindCommentResponsesItemPostFindSiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface PostDetailResponsePostFindSiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface PostDetailResponsePostFindBoardResponse {
  code: string;
  koreanName: string;
}

export interface PostDetailResponse {
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
  postFindBoardResponse: PostDetailResponsePostFindBoardResponse;
  postFindSiteUserResponse: PostDetailResponsePostFindSiteUserResponse;
  postFindCommentResponses: PostDetailResponsePostFindCommentResponsesItem[];
  postFindPostImageResponses: PostDetailResponsePostFindPostImageResponsesItem[];
}

export interface LikePostResponse {
  likeCount: number;
  isLiked: boolean;
}

export type LikePostRequest = Record<string, never>;

export const communityApi = {
  getBoardList: async (params: { params?: Record<string, unknown> }): Promise<BoardListResponse> => {
    const res = await axiosInstance.get<BoardListResponse>(
      `/boards`, { params: params?.params }
    );
    return res.data;
  },

  getBoard: async (params: { boardCode: string | number, params?: Record<string, unknown> }): Promise<BoardResponse> => {
    const res = await axiosInstance.get<BoardResponse>(
      `/boards/${params.boardCode}`, { params: params?.params }
    );
    return res.data;
  },

  deleteComment: async (params: { commentId: string | number }): Promise<CommentResponse> => {
    const res = await axiosInstance.delete<CommentResponse>(
      `/comments/${params.commentId}`
    );
    return res.data;
  },

  patchUpdateComment: async (params: { commentId: string | number, data?: UpdateCommentRequest }): Promise<UpdateCommentResponse> => {
    const res = await axiosInstance.patch<UpdateCommentResponse>(
      `/comments/${params.commentId}`, params?.data
    );
    return res.data;
  },

  postCreateComment: async (params: { data?: CreateCommentRequest }): Promise<CreateCommentResponse> => {
    const res = await axiosInstance.post<CreateCommentResponse>(
      `/comments`, params?.data
    );
    return res.data;
  },

  deletePost: async (params: { postId: string | number }): Promise<PostResponse> => {
    const res = await axiosInstance.delete<PostResponse>(
      `/posts/${params.postId}`
    );
    return res.data;
  },

  patchUpdatePost: async (params: { postId: string | number, data?: UpdatePostRequest }): Promise<UpdatePostResponse> => {
    const res = await axiosInstance.patch<UpdatePostResponse>(
      `/posts/${params.postId}`, params?.data
    );
    return res.data;
  },

  postCreatePost: async (params: { data?: CreatePostRequest }): Promise<CreatePostResponse> => {
    const res = await axiosInstance.post<CreatePostResponse>(
      `/posts`, params?.data
    );
    return res.data;
  },

  getPostDetail: async (params: { postId: string | number, params?: Record<string, unknown> }): Promise<PostDetailResponse> => {
    const res = await axiosInstance.get<PostDetailResponse>(
      `/posts/${params.postId}`, { params: params?.params }
    );
    return res.data;
  },

  postLikePost: async (params: { postId: string | number, data?: LikePostRequest }): Promise<LikePostResponse> => {
    const res = await axiosInstance.post<LikePostResponse>(
      `/posts/${params.postId}/like`, params?.data
    );
    return res.data;
  },

  deleteLikePost: async (params: { postId: string | number }): Promise<LikePostResponse> => {
    const res = await axiosInstance.delete<LikePostResponse>(
      `/posts/${params.postId}/like`
    );
    return res.data;
  },

};
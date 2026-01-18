import { AxiosResponse } from "axios";

import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import {
  CommentCreateRequest,
  CommentIdResponse,
  ListPost,
  Post,
  PostCreateRequest,
  PostIdResponse,
  PostLikeResponse,
  PostUpdateRequest,
} from "@/types/community";

// QueryKeys for community domain
export const CommunityQueryKeys = {
  posts: "posts",
  postList: "postList1", // 기존 api/boards와 동일한 키 유지
} as const;

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
  0: BoardResponseItem[];
  1: BoardResponseItem[];
  2: BoardResponseItem[];
  3: BoardResponseItem[];
}

// Delete response types
export interface DeletePostResponse {
  message: string;
  postId: number;
}

// Re-export types from @/types/community for convenience
export type {
  Post,
  PostCreateRequest,
  PostIdResponse,
  PostUpdateRequest,
  PostLikeResponse,
  CommentCreateRequest,
  CommentIdResponse,
  ListPost,
};

export const communityApi = {
  /**
   * 게시글 목록 조회 (클라이언트)
   */
  getPostList: (boardCode: string, category: string | null = null): Promise<AxiosResponse<ListPost[]>> => {
    const params = category && category !== "전체" ? { category } : {};
    return publicAxiosInstance.get(`/boards/${boardCode}`, { params });
  },

  getBoardList: async (params?: Record<string, any>): Promise<BoardListResponse> => {
    const res = await axiosInstance.get<BoardListResponse>(`/boards`, { params });
    return res.data;
  },

  getBoard: async (boardCode: string, params?: Record<string, any>): Promise<BoardResponse> => {
    const res = await axiosInstance.get<BoardResponse>(`/boards/${boardCode}`, { params });
    return res.data;
  },

  getPostDetail: async (postId: number): Promise<Post> => {
    const response: AxiosResponse<Post> = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  },

  createPost: async (request: PostCreateRequest): Promise<PostIdResponse & { boardCode: string }> => {
    const convertedRequest: FormData = new FormData();
    convertedRequest.append(
      "postCreateRequest",
      new Blob([JSON.stringify(request.postCreateRequest)], { type: "application/json" }),
    );
    request.file.forEach((file) => {
      convertedRequest.append("file", file);
    });

    const response: AxiosResponse<PostIdResponse> = await axiosInstance.post(`/posts`, convertedRequest, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      ...response.data,
      boardCode: request.postCreateRequest.boardCode,
    };
  },

  updatePost: async (postId: number, request: PostUpdateRequest): Promise<PostIdResponse> => {
    const convertedRequest: FormData = new FormData();
    convertedRequest.append(
      "postUpdateRequest",
      new Blob([JSON.stringify(request.postUpdateRequest)], { type: "application/json" }),
    );
    request.file.forEach((file) => {
      convertedRequest.append("file", file);
    });

    const response: AxiosResponse<PostIdResponse> = await axiosInstance.patch(`/posts/${postId}`, convertedRequest, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deletePost: async (postId: number): Promise<AxiosResponse<DeletePostResponse>> => {
    return axiosInstance.delete(`/posts/${postId}`);
  },

  likePost: async (postId: number): Promise<PostLikeResponse> => {
    const response: AxiosResponse<PostLikeResponse> = await axiosInstance.post(`/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId: number): Promise<PostLikeResponse> => {
    const response: AxiosResponse<PostLikeResponse> = await axiosInstance.delete(`/posts/${postId}/like`);
    return response.data;
  },

  createComment: async (request: CommentCreateRequest): Promise<CommentIdResponse> => {
    const response: AxiosResponse<CommentIdResponse> = await axiosInstance.post(`/comments`, request);
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<CommentIdResponse> => {
    const response: AxiosResponse<CommentIdResponse> = await axiosInstance.delete(`/comments/${commentId}`);
    return response.data;
  },

  updateComment: async (commentId: number, data: { content: string }): Promise<CommentIdResponse> => {
    const res = await axiosInstance.patch<CommentIdResponse>(`/comments/${commentId}`, data);
    return res.data;
  },
};

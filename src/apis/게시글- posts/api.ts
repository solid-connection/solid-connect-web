import { axiosInstance } from "@/utils/axiosInstance";

export type 게시글 삭제Response = void;

export type 게시글 수정Response = void;

export type 게시글 수정Request = Record<string, never>;

export type 게시글 작성Response = void;

export type 게시글 작성Request = Record<string, never>;

export interface 게시글 조회ResponsePostFindCommentResponsesItem {
  id: number;
  parentId: null | number;
  content: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  postFindSiteUserResponse: 게시글 조회ResponsePostFindCommentResponsesItemPostFindSiteUserResponse;
}

export interface 게시글 조회ResponsePostFindCommentResponsesItemPostFindSiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface 게시글 조회ResponsePostFindSiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface 게시글 조회ResponsePostFindBoardResponse {
  code: string;
  koreanName: string;
}

export interface 게시글 조회Response {
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
  postFindBoardResponse: 게시글 조회ResponsePostFindBoardResponse;
  postFindSiteUserResponse: 게시글 조회ResponsePostFindSiteUserResponse;
  postFindCommentResponses: 게시글 조회ResponsePostFindCommentResponsesItem[];
  postFindPostImageResponses: any[];
}

export interface 게시글 좋아요 등록Response {
  likeCount: number;
  isLiked: boolean;
}

export type 게시글 좋아요 등록Request = Record<string, never>;

export interface 게시글 좋아요 삭제Response {
  likeCount: number;
  isLiked: boolean;
}

export const 게시글 postsApi = {
  delete게시글 삭제: async (params: { postId: string | number }): Promise<게시글 삭제Response> => {
    const res = await axiosInstance.delete<게시글 삭제Response>(
      `/posts/${params.postId}`
    );
    return res.data;
  },

  patch게시글 수정: async (params: { postId: string | number, data?: 게시글 수정Request }): Promise<게시글 수정Response> => {
    const res = await axiosInstance.patch<게시글 수정Response>(
      `/posts/${params.postId}`, params?.data
    );
    return res.data;
  },

  post게시글 작성: async (params: { data?: 게시글 작성Request }): Promise<게시글 작성Response> => {
    const res = await axiosInstance.post<게시글 작성Response>(
      `/posts`, params?.data
    );
    return res.data;
  },

  get게시글 조회: async (params: { postId: string | number, params?: Record<string, any> }): Promise<게시글 조회Response> => {
    const res = await axiosInstance.get<게시글 조회Response>(
      `/posts/${params.postId}`, { params: params?.params }
    );
    return res.data;
  },

  post게시글 좋아요 등록: async (params: { postId: string | number, data?: 게시글 좋아요 등록Request }): Promise<게시글 좋아요 등록Response> => {
    const res = await axiosInstance.post<게시글 좋아요 등록Response>(
      `/posts/${params.postId}/like`, params?.data
    );
    return res.data;
  },

  delete게시글 좋아요 삭제: async (params: { postId: string | number }): Promise<게시글 좋아요 삭제Response> => {
    const res = await axiosInstance.delete<게시글 좋아요 삭제Response>(
      `/posts/${params.postId}/like`
    );
    return res.data;
  },

};
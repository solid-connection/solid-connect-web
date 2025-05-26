import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

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

export const getPostListApi = (boardCode: string, category: string | null = null): Promise<AxiosResponse<ListPost[]>> =>
  axiosInstance.get(`/boards/${boardCode}`, {
    params: {
      category,
    },
  });

export const getPostDetailApi = (postId: number): Promise<AxiosResponse<Post>> => axiosInstance.get(`/posts/${postId}`);

export const createPostApi = (postCreateRequest: PostCreateRequest): Promise<AxiosResponse<PostIdResponse>> => {
  const convertedRequest: FormData = new FormData();
  convertedRequest.append(
    "postCreateRequest",
    new Blob([JSON.stringify(postCreateRequest.postCreateRequest)], { type: "application/json" }),
  );
  postCreateRequest.file.forEach((file) => {
    convertedRequest.append("file", file);
  });

  return axiosInstance.post(`/posts`, convertedRequest, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePostApi = (
  postId: number,
  postUpdateRequest: PostUpdateRequest,
): Promise<AxiosResponse<PostIdResponse>> => {
  const convertedRequest: FormData = new FormData();
  convertedRequest.append(
    "postUpdateRequest",
    new Blob([JSON.stringify(postUpdateRequest.postUpdateRequest)], { type: "application/json" }),
  );
  postUpdateRequest.file.forEach((file) => {
    convertedRequest.append("file", file);
  });
  return axiosInstance.patch(`/posts/${postId}`, convertedRequest, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePostApi = (postId: number): Promise<AxiosResponse<PostIdResponse>> =>
  axiosInstance.delete(`/posts/${postId}`);

export const likePostApi = (postId: number): Promise<AxiosResponse<PostLikeResponse>> =>
  axiosInstance.post(`/posts/${postId}/like`);

export const unlikePostApi = (postId: number): Promise<AxiosResponse<PostLikeResponse>> =>
  axiosInstance.delete(`/posts/${postId}/like`);

export const createCommentApi = (
  commentCreateRequest: CommentCreateRequest,
): Promise<AxiosResponse<CommentIdResponse>> => axiosInstance.post(`/comments`, commentCreateRequest);

export const deleteCommentApi = (commentId: number): Promise<AxiosResponse<CommentIdResponse>> =>
  axiosInstance.delete(`/comments/${commentId}`);

// export const updateCommentApi

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
  axiosInstance.get(`/communities/${boardCode}`, {
    params: {
      category,
    },
  });

export const getPostDetailApi = (boardCode: string, postId: number): Promise<AxiosResponse<Post>> =>
  axiosInstance.get(`/communities/${boardCode}/posts/${postId}`);

export const createPostApi = (
  boardCode: string,
  postCreateRequest: PostCreateRequest,
): Promise<AxiosResponse<PostIdResponse>> => {
  const convertedRequest: FormData = new FormData();
  convertedRequest.append(
    "postCreateRequest",
    new Blob([JSON.stringify(postCreateRequest.postCreateRequest)], { type: "application/json" }),
  );
  postCreateRequest.file.forEach((file) => {
    convertedRequest.append("file", file);
  });

  return axiosInstance.post(`/communities/${boardCode}/posts`, convertedRequest, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePostApi = (
  boardCode: string,
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
  return axiosInstance.patch(`/communities/${boardCode}/posts/${postId}`, convertedRequest, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePostApi = (boardCode: string, postId: number): Promise<AxiosResponse<PostIdResponse>> =>
  axiosInstance.delete(`/communities/${boardCode}/posts/${postId}`);

export const likePostApi = (boardCode, postId: number): Promise<AxiosResponse<PostLikeResponse>> =>
  axiosInstance.post(`/communities/${boardCode}/posts/${postId}/like`);

export const unlikePostApi = (boardCode, postId: number): Promise<AxiosResponse<PostLikeResponse>> =>
  axiosInstance.delete(`/communities/${boardCode}/posts/${postId}/like`);

export const createCommentApi = (
  postId: number,
  commentCreateRequest: CommentCreateRequest,
): Promise<AxiosResponse<CommentIdResponse>> => axiosInstance.post(`/posts/${postId}/comments`, commentCreateRequest);

export const deleteCommentApi = (postId: number, commentId: number): Promise<AxiosResponse<CommentIdResponse>> =>
  axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);

// export const updateCommentApi

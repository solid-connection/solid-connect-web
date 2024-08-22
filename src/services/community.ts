import { AxiosResponse } from "axios";

import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import { ListPost, Post, PostCreateRequest, PostIdResponse, PostUpdateRequest } from "@/types/community";

export const getPostListApi = (
  boardCode: string,
  category: string | null = null,
): Promise<AxiosResponse<ListPost[]>> => {
  return axiosInstance.get(`/communities/${boardCode}`, {
    params: {
      category: category,
    },
  });
};

export const getPostDetailApi = (boardCode: string, postId: number): Promise<AxiosResponse<Post>> => {
  return axiosInstance.get(`/communities/${boardCode}/posts/${postId}`);
};

export const createPostApi = (
  boardCode: string,
  postCreateRequest: PostCreateRequest,
): Promise<AxiosResponse<PostIdResponse>> => {
  const convertedRequest: FormData = new FormData();
  convertedRequest.append(
    "postCreateRequest",
    new Blob([JSON.stringify(postCreateRequest.postCreateRequest)], { type: "application/json" }),
  );
  postCreateRequest.files.forEach((file) => {
    convertedRequest.append("files", file);
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
  return axiosInstance.patch(`/communities/${boardCode}/posts/${postId}`, postUpdateRequest);
};

export const deletePostApi = (boardCode: string, postId: number): Promise<AxiosResponse<PostIdResponse>> => {
  return axiosInstance.delete(`/communities/${boardCode}/posts/${postId}`);
};

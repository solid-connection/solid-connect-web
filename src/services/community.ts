import { AxiosResponse } from "axios";

import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import { ListPost, Post } from "@/types/community";

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

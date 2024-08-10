import { AxiosResponse } from "axios";

import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import { Post } from "@/types/community";

export const getPostDetailApi = (boardCode: string, postId: number): Promise<AxiosResponse<Post>> => {
  return axiosInstance.get(`/communities/${boardCode}/posts/${postId}`);
};

import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostCreatePostRequest {
  // TODO: Define request type
}

export interface PostCreatePostResponse {
  id: number;
}

const postCreatePost = async (params: { data?: PostCreatePostRequest }): Promise<PostCreatePostResponse> => {
  const res = await axiosInstance.post<PostCreatePostResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostCreatePost = () => {
  return useMutation<PostCreatePostResponse, AxiosError, PostCreatePostRequest>({
    mutationFn: (data) => postCreatePost({ data }),
  });
};

export default usePostCreatePost;
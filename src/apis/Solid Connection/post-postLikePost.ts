import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostLikePostRequest {
  // TODO: Define request type
}

export interface PostLikePostResponse {
  likeCount: number;
  isLiked: boolean;
}

const postLikePost = async (params: { data?: PostLikePostRequest }): Promise<PostLikePostResponse> => {
  const res = await axiosInstance.post<PostLikePostResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostLikePost = () => {
  return useMutation<PostLikePostResponse, AxiosError, PostLikePostRequest>({
    mutationFn: (data) => postLikePost({ data }),
  });
};

export default usePostLikePost;
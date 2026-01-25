import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { communityApi, LikePostResponse, LikePostRequest } from "./api";

const usePostLikePost = () => {
  return useMutation<LikePostResponse, AxiosError, { postId: string | number; data: LikePostRequest }>({
    mutationFn: (variables) => communityApi.postLikePost(variables),
  });
};

export default usePostLikePost;
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { communityApi, LikePostResponse, LikePostRequest } from "./api";

const useDeleteLikePost = () => {
  return useMutation<LikePostResponse, AxiosError, { postId: string | number; data: LikePostRequest }>({
    mutationFn: (variables) => communityApi.deleteLikePost(variables),
  });
};

export default useDeleteLikePost;
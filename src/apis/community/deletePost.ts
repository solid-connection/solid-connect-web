import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { communityApi, PostResponse, PostRequest } from "./api";

const useDeletePost = () => {
  return useMutation<PostResponse, AxiosError, { postId: string | number; data: PostRequest }>({
    mutationFn: (variables) => communityApi.deletePost(variables),
  });
};

export default useDeletePost;
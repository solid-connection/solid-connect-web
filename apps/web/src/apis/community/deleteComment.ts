import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { communityApi, CommentResponse, CommentRequest } from "./api";

const useDeleteComment = () => {
  return useMutation<CommentResponse, AxiosError, { commentId: string | number; data: CommentRequest }>({
    mutationFn: (variables) => communityApi.deleteComment(variables),
  });
};

export default useDeleteComment;
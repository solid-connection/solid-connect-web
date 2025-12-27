import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { communityApi, UpdateCommentResponse, UpdateCommentRequest } from "./api";

const usePatchUpdateComment = () => {
  return useMutation<UpdateCommentResponse, AxiosError, { commentId: string | number; data: UpdateCommentRequest }>({
    mutationFn: (variables) => communityApi.patchUpdateComment(variables),
  });
};

export default usePatchUpdateComment;
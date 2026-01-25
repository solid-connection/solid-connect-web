import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type CommentIdResponse, communityApi } from "./api";

const usePatchUpdateComment = () => {
  return useMutation<CommentIdResponse, AxiosError, { commentId: number; content: string }>({
    mutationFn: ({ commentId, content }) => communityApi.updateComment(commentId, { content }),
  });
};

export default usePatchUpdateComment;

import { AxiosError } from "axios";

import { CommentIdResponse, communityApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePatchUpdateComment = () => {
  return useMutation<CommentIdResponse, AxiosError, { commentId: number; content: string }>({
    mutationFn: ({ commentId, content }) => communityApi.updateComment(commentId, { content }),
  });
};

export default usePatchUpdateComment;

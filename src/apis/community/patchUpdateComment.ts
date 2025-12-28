import { AxiosError } from "axios";

import { UpdateCommentRequest, UpdateCommentResponse, communityApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePatchUpdateComment = () => {
  return useMutation<UpdateCommentResponse, AxiosError, { commentId: string | number; data: UpdateCommentRequest }>({
    mutationFn: (variables) => communityApi.patchUpdateComment(variables),
  });
};

export default usePatchUpdateComment;

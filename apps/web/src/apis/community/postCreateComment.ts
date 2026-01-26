import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { communityApi, CreateCommentResponse, CreateCommentRequest } from "./api";

const usePostCreateComment = () => {
  return useMutation<CreateCommentResponse, AxiosError, CreateCommentRequest>({
    mutationFn: (data) => communityApi.postCreateComment({ data }),
  });
};

export default usePostCreateComment;
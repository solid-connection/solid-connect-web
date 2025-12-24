import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostCreateCommentRequest {
  // TODO: Define request type
}

export interface PostCreateCommentResponse {
  id: number;
}

const postCreateComment = async (params: { data?: PostCreateCommentRequest }): Promise<PostCreateCommentResponse> => {
  const res = await axiosInstance.post<PostCreateCommentResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostCreateComment = () => {
  return useMutation<PostCreateCommentResponse, AxiosError, PostCreateCommentRequest>({
    mutationFn: (data) => postCreateComment({ data }),
  });
};

export default usePostCreateComment;
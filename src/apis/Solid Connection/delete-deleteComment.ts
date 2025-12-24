import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface DeleteCommentRequest {
  // TODO: Define request type
}

export interface DeleteCommentResponse {
  id: number;
}

const deleteComment = async (): Promise<DeleteCommentResponse> => {
  const res = await axiosInstance.delete<DeleteCommentResponse>(
    `{`
  );
  return res.data;
};

const useDeleteComment = () => {
  return useMutation<DeleteCommentResponse, AxiosError, DeleteCommentRequest>({
    mutationFn: (data) => deleteComment({ data }),
  });
};

export default useDeleteComment;
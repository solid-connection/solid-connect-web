import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface DeleteLikePostRequest {
  // TODO: Define request type
}

export interface DeleteLikePostResponse {
  likeCount: number;
  isLiked: boolean;
}

const deleteLikePost = async (): Promise<DeleteLikePostResponse> => {
  const res = await axiosInstance.delete<DeleteLikePostResponse>(
    `{`
  );
  return res.data;
};

const useDeleteLikePost = () => {
  return useMutation<DeleteLikePostResponse, AxiosError, DeleteLikePostRequest>({
    mutationFn: (data) => deleteLikePost({ data }),
  });
};

export default useDeleteLikePost;
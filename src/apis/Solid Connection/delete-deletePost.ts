import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface DeletePostRequest {
  // TODO: Define request type
}

export interface DeletePostResponse {
  id: number;
}

const deletePost = async (): Promise<DeletePostResponse> => {
  const res = await axiosInstance.delete<DeletePostResponse>(
    `{`
  );
  return res.data;
};

const useDeletePost = () => {
  return useMutation<DeletePostResponse, AxiosError, DeletePostRequest>({
    mutationFn: (data) => deletePost({ data }),
  });
};

export default useDeletePost;
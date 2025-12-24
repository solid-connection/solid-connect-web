import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface DeleteLikeNewsRequest {
  // TODO: Define request type
}

const deleteLikeNews = async (): Promise<DeleteLikeNewsResponse> => {
  const res = await axiosInstance.delete<DeleteLikeNewsResponse>(
    `{`
  );
  return res.data;
};

const useDeleteLikeNews = () => {
  return useMutation<DeleteLikeNewsResponse, AxiosError, DeleteLikeNewsRequest>({
    mutationFn: (data) => deleteLikeNews({ data }),
  });
};

export default useDeleteLikeNews;
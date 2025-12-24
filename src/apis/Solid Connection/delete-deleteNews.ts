import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface DeleteNewsRequest {
  // TODO: Define request type
}

export interface DeleteNewsResponse {
  id: number;
}

const deleteNews = async (): Promise<DeleteNewsResponse> => {
  const res = await axiosInstance.delete<DeleteNewsResponse>(
    `{`
  );
  return res.data;
};

const useDeleteNews = () => {
  return useMutation<DeleteNewsResponse, AxiosError, DeleteNewsRequest>({
    mutationFn: (data) => deleteNews({ data }),
  });
};

export default useDeleteNews;
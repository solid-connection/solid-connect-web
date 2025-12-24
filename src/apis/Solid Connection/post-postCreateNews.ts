import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostCreateNewsRequest {
  // TODO: Define request type
}

export interface PostCreateNewsResponse {
  id: number;
}

const postCreateNews = async (params: { data?: PostCreateNewsRequest }): Promise<PostCreateNewsResponse> => {
  const res = await axiosInstance.post<PostCreateNewsResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostCreateNews = () => {
  return useMutation<PostCreateNewsResponse, AxiosError, PostCreateNewsRequest>({
    mutationFn: (data) => postCreateNews({ data }),
  });
};

export default usePostCreateNews;
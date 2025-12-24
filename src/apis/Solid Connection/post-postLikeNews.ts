import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostLikeNewsRequest {
  // TODO: Define request type
}

const postLikeNews = async (params: { data?: PostLikeNewsRequest }): Promise<PostLikeNewsResponse> => {
  const res = await axiosInstance.post<PostLikeNewsResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostLikeNews = () => {
  return useMutation<PostLikeNewsResponse, AxiosError, PostLikeNewsRequest>({
    mutationFn: (data) => postLikeNews({ data }),
  });
};

export default usePostLikeNews;
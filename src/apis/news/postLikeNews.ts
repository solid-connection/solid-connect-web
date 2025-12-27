import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { newsApi, LikeNewsResponse, LikeNewsRequest } from "./api";

const usePostLikeNews = () => {
  return useMutation<LikeNewsResponse, AxiosError, { newsId: string | number; data: LikeNewsRequest }>({
    mutationFn: (variables) => newsApi.postLikeNews(variables),
  });
};

export default usePostLikeNews;
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { newsApi, LikeNewsResponse, LikeNewsRequest } from "./api";

const useDeleteLikeNews = () => {
  return useMutation<LikeNewsResponse, AxiosError, { newsId: string | number; data: LikeNewsRequest }>({
    mutationFn: (variables) => newsApi.deleteLikeNews(variables),
  });
};

export default useDeleteLikeNews;
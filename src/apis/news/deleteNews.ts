import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { newsApi, NewsResponse, NewsRequest } from "./api";

const useDeleteNews = () => {
  return useMutation<NewsResponse, AxiosError, { newsId: string | number; data: NewsRequest }>({
    mutationFn: (variables) => newsApi.deleteNews(variables),
  });
};

export default useDeleteNews;
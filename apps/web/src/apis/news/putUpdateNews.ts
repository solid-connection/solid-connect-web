import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { newsApi, UpdateNewsResponse, UpdateNewsRequest } from "./api";

const usePutUpdateNews = () => {
  return useMutation<UpdateNewsResponse, AxiosError, { newsId: string | number; data: UpdateNewsRequest }>({
    mutationFn: (variables) => newsApi.putUpdateNews(variables),
  });
};

export default usePutUpdateNews;
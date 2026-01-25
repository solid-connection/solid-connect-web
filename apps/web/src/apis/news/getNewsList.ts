import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { newsApi, NewsListResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetNewsList = (params?: Record<string, any>) => {
  return useQuery<NewsListResponse, AxiosError>({
    queryKey: [QueryKeys.news.newsList, params],
    queryFn: () => newsApi.getNewsList(params ? { params } : {}),
  });
};

export default useGetNewsList;
import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { ArticleResponse } from "../types/response";
import { QueryKeys } from "./queryKey";

import { useQuery } from "@tanstack/react-query";

/* ---------- 타입 ---------- */

interface ArticleListResponse {
  news: ArticleResponse[]; // 최대 5개
}

const getArticleList = async (userId: number): Promise<ArticleListResponse> => {
  const response: AxiosResponse<ArticleListResponse> = await axiosInstance.get(`/news?site-user-id=${userId}`);
  return response.data;
};

const useGetArticleList = (userId: number | null) => {
  return useQuery({
    queryKey: [QueryKeys.articleList, userId],
    queryFn: () => getArticleList(userId!),
    enabled: userId !== null,
    select: (data: ArticleListResponse) => data.news,
  });
};

export default useGetArticleList;

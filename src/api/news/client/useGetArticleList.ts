import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { Article } from "@/types/news";

import { useQuery } from "@tanstack/react-query";

/* ---------- 타입 ---------- */

interface ArticleListResponse {
  newsResponseList: Article[]; // 최대 5개
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
    select: (data: ArticleListResponse) => data.newsResponseList,
  });
};

export default useGetArticleList;

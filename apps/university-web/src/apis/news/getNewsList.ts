import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { Article } from "@/types/news";
import { type ArticleListResponse, NewsQueryKeys, newsApi } from "./api";

/**
 * @description 아티클 목록 조회 훅
 */
const useGetArticleList = (userId: number, options?: { enabled?: boolean }) => {
  return useQuery<ArticleListResponse, AxiosError, Article[]>({
    queryKey: [NewsQueryKeys.articleList, userId],
    queryFn: () => newsApi.getArticleList(userId),
    staleTime: 1000 * 60 * 10, // 10분
    enabled: userId !== 0 && (options?.enabled ?? true),
    select: (data) => data.newsResponseList,
  });
};

export default useGetArticleList;

import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useQuery } from "@tanstack/react-query";

/* ---------- 타입 ---------- */

interface ArticleListResponse {
  isLike: boolean;
}

const getArticleIsLiked = async (newsId: number): Promise<ArticleListResponse> => {
  const response: AxiosResponse<ArticleListResponse> = await axiosInstance.get(`/news/${newsId}/like`);
  return response.data;
};

const useGetArticleIsLiked = (newsId: number) => {
  return useQuery({
    queryKey: [QueryKeys.articleList, newsId],
    queryFn: () => getArticleIsLiked(newsId!),
    enabled: newsId !== null,
    select: (data: ArticleListResponse) => data.isLike,
  });
};

export default useGetArticleIsLiked;

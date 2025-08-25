import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { Article } from "@/types/news";

import { useQuery } from "@tanstack/react-query";

interface ArticleListResponse {
  newsResponseList: Article[];
}

const getArticleList = async (userId: number): Promise<ArticleListResponse> => {
  const response: AxiosResponse<ArticleListResponse> = await axiosInstance.get(`/news?site-user-id=${userId}`);
  return response.data;
};

const useGetArticleList = (userId: number) => {
  return useQuery<ArticleListResponse, Error, Article[]>({
    queryKey: [QueryKeys.articleList, userId],
    queryFn: () => {
      // enabled 옵션이 있더라도, 타입 가드를 추가하면 더 안전합니다.
      if (userId === null) {
        return Promise.reject(new Error("User ID is null"));
      }
      return getArticleList(userId);
    },
    staleTime: 1000 * 60 * 10, // ⏱️ 10분

    enabled: userId !== null,
    // 서버 응답(ArticleListResponse)에서 실제 데이터 배열(Article[])만 선택합니다.
    select: (data) => data.newsResponseList,
  });
};

export default useGetArticleList;

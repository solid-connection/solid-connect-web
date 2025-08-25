import { AxiosError, AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { Article } from "@/types/news";

import { useMutation, useQueryClient } from "@tanstack/react-query";

// Article 타입 import 필요

// 1. 롤백을 위해 이전 데이터를 저장할 context 타입을 정의합니다.
type ArticleDeleteMutationContext = {
  previousArticleList?: Article[];
};

const deleteArticle = async (articleId: number): Promise<void> => {
  const response: AxiosResponse<void> = await axiosInstance.delete(`/news/${articleId}`);
  return response.data;
};

// 2. 어떤 유저의 목록을 업데이트할지 식별하기 위해 userId를 props로 받습니다.
const useDeleteArticle = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = [QueryKeys.articleList, userId];

  return useMutation<
    void, // 성공 시 반환 타입
    AxiosError<{ message: string }>, // 에러 타입
    number, // mutate 함수에 전달하는 변수 타입 (articleId)
    ArticleDeleteMutationContext // context 타입
  >({
    mutationFn: deleteArticle,

    onMutate: async (deletedArticleId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousArticleList = queryClient.getQueryData<Article[]>(queryKey);

      queryClient.setQueryData<{ newsResponseList: Article[] }>(queryKey, (oldData) => {
        if (!oldData) return { newsResponseList: [] };
        return {
          newsResponseList: oldData.newsResponseList.filter((article) => article.id !== deletedArticleId),
        };
      });

      return { previousArticleList };
    },

    onError: (error, variables, context) => {
      if (context?.previousArticleList) {
        queryClient.setQueryData<Article[]>(queryKey, context.previousArticleList);
      }
      alert("아티클 삭제에 실패했습니다. 다시 시도해주세요.");
      console.error("Failed to delete article:", error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export default useDeleteArticle;

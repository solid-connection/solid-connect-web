import { AxiosError } from "axios";

import { ArticleListResponse, NewsQueryKeys, newsApi } from "./api";

import { Article } from "@/types/news";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ArticleDeleteMutationContext = {
  previousArticleList?: Article[];
};

/**
 * @description 아티클 삭제 훅
 */
const useDeleteArticle = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = [NewsQueryKeys.articleList, userId];

  return useMutation<void, AxiosError<{ message: string }>, number, ArticleDeleteMutationContext>({
    mutationFn: newsApi.deleteArticle,

    onMutate: async (deletedArticleId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousArticleList = queryClient.getQueryData<Article[]>(queryKey);

      queryClient.setQueryData<ArticleListResponse>(queryKey, (oldData) => {
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
      toast.error("아티클 삭제에 실패했습니다. 다시 시도해주세요.");
      console.error("Failed to delete article:", error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export default useDeleteArticle;

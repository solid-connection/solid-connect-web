import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Article } from "@/types/news";
import { type ArticleListResponse, NewsQueryKeys, newsApi } from "./api";

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

    onError: (_error, _variables, context) => {
      if (context?.previousArticleList) {
        queryClient.setQueryData<Article[]>(queryKey, context.previousArticleList);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export default useDeleteArticle;

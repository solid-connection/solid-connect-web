import { AxiosError } from "axios";

import { ArticleListResponse, NewsQueryKeys, UsePutModifyArticleRequest, newsApi } from "./api";

import { Article } from "@/types/news";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ArticleMutationContext = {
  previousArticleList?: Article[];
};

/**
 * @description 아티클 수정 훅
 */
const usePutModifyArticle = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = [NewsQueryKeys.articleList, userId];

  return useMutation<Article, AxiosError<{ message: string }>, UsePutModifyArticleRequest, ArticleMutationContext>({
    mutationFn: newsApi.putModifyArticle,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousArticleList = queryClient.getQueryData<Article[]>(queryKey);

      queryClient.setQueryData<ArticleListResponse>(queryKey, (oldData) => {
        if (!oldData) return { newsResponseList: [] };

        return {
          newsResponseList: oldData.newsResponseList.map((article) => {
            if (article.id === variables.articleId) {
              const optimisticData = variables.body;

              return {
                ...article,
                title: optimisticData.title,
                description: optimisticData.description,
                url: optimisticData.url || "",
                thumbnailUrl: optimisticData.file ? URL.createObjectURL(optimisticData.file) : article.thumbnailUrl,
              };
            }
            return article;
          }),
        };
      });
      return { previousArticleList };
    },
    onError: (error, variables, context) => {
      const errorMessage = error.response?.data?.message || "";
      if (context?.previousArticleList) {
        queryClient.setQueryData(queryKey, context.previousArticleList);
      }
      toast.error("아티클 수정에 실패했습니다." + errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export default usePutModifyArticle;

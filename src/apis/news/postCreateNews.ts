import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newsApi, NewsQueryKeys, UsePostAddArticleRequest, ArticleListResponse } from "./api";
import { Article } from "@/types/news";
import { toast } from "@/lib/zustand/useToastStore";
import ArticleThumbUrlPng from "@/public/images/article-thumb.png";

type ArticleMutationContext = {
  previousArticleContainer?: ArticleListResponse;
};

/**
 * @description 아티클 추가 훅
 */
const usePostAddArticle = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = [NewsQueryKeys.articleList, userId];

  return useMutation<Article, AxiosError<{ message: string }>, UsePostAddArticleRequest, ArticleMutationContext>({
    mutationFn: newsApi.postAddArticle,
    onMutate: async (newArticle) => {
      await queryClient.cancelQueries({ queryKey });

      const previousArticleContainer = queryClient.getQueryData<ArticleListResponse>(queryKey);

      queryClient.setQueryData<ArticleListResponse>(queryKey, (oldData) => {
        if (!oldData) return { newsResponseList: [] };

        const optimisticArticle: Article = {
          id: Date.now(), // 임시 ID
          title: newArticle.title,
          description: newArticle.description,
          url: newArticle.url || "",
          thumbnailUrl: newArticle.file ? URL.createObjectURL(newArticle.file) : ArticleThumbUrlPng.src,
          updatedAt: new Date().toISOString(),
        };

        return {
          newsResponseList: [optimisticArticle, ...oldData.newsResponseList],
        };
      });
      return { previousArticleContainer };
    },
    onError: (error, variables, context) => {
      const errorMessage = error.response?.data?.message || "";
      if (context?.previousArticleContainer) {
        queryClient.setQueryData(queryKey, context.previousArticleContainer);
      }
      toast.error("아티클 추가에 실패했습니다: " + errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export default usePostAddArticle;
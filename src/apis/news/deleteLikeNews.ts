import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { type ArticleListResponse, type DeleteArticleLikeResponse, NewsQueryKeys, newsApi } from "./api";

type ArticleLikeMutationContext = {
  previousArticleList?: ArticleListResponse;
};

/**
 * @description 아티클 좋아요 취소 훅
 */
const useDeleteArticleLike = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = [NewsQueryKeys.articleList, userId];

  return useMutation<DeleteArticleLikeResponse, AxiosError<{ message: string }>, number, ArticleLikeMutationContext>({
    mutationFn: newsApi.deleteArticleLike,

    onMutate: async (unlikedArticleId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousArticleList = queryClient.getQueryData<ArticleListResponse>(queryKey);

      queryClient.setQueryData<ArticleListResponse>(queryKey, (oldData) => {
        if (!oldData) return { newsResponseList: [] };
        return {
          newsResponseList: oldData.newsResponseList.map((article) =>
            article.id === unlikedArticleId
              ? {
                  ...article,
                  isLiked: false,
                  likeCount: Math.max(0, (article.likeCount ?? 1) - 1),
                }
              : article,
          ),
        };
      });

      return { previousArticleList };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousArticleList) {
        queryClient.setQueryData<ArticleListResponse>(queryKey, context.previousArticleList);
      }
    },
  });
};

export default useDeleteArticleLike;

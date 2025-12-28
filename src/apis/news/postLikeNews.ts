import { AxiosError } from "axios";

import { ArticleListResponse, NewsQueryKeys, PostArticleLikeResponse, newsApi } from "./api";

import { Article } from "@/types/news";

import { useMutation, useQueryClient } from "@tanstack/react-query";

type ArticleLikeMutationContext = {
  previousArticleList?: Article[];
};

/**
 * @description 아티클 좋아요 훅
 */
const usePostArticleLike = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = [NewsQueryKeys.articleList, userId];

  return useMutation<PostArticleLikeResponse, AxiosError<{ message: string }>, number, ArticleLikeMutationContext>({
    mutationFn: newsApi.postArticleLike,

    onMutate: async (likedArticleId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousArticleList = queryClient.getQueryData<Article[]>(queryKey);

      queryClient.setQueryData<ArticleListResponse>(queryKey, (oldData) => {
        if (!oldData) return { newsResponseList: [] };
        return {
          newsResponseList: oldData.newsResponseList.map((article) =>
            article.id === likedArticleId
              ? {
                  ...article,
                  isLiked: true,
                  likeCount: (article.likeCount ?? 0) + 1,
                }
              : article,
          ),
        };
      });

      return { previousArticleList };
    },

    onError: (err, variables, context) => {
      if (context?.previousArticleList) {
        queryClient.setQueryData<Article[]>(queryKey, context.previousArticleList);
      }
    },
  });
};

export default usePostArticleLike;

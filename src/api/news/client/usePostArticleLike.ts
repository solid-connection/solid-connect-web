import { AxiosError, AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { Article } from "@/types/news";

import { useMutation, useQueryClient } from "@tanstack/react-query";

// Article 타입 import

interface PostArticleLikeResponse {
  isLiked: boolean;
  likeCount: number;
}

// 1. 롤백을 위한 context 타입을 정의합니다.
type ArticleLikeMutationContext = {
  previousArticleList?: Article[];
};

const postArticleLike = async (articleId: number): Promise<PostArticleLikeResponse> => {
  const response: AxiosResponse<PostArticleLikeResponse> = await axiosInstance.post(`/news/${articleId}/like`);
  return response.data;
};

// 2. 어떤 유저의 목록을 업데이트할지 식별하기 위해 userId를 props로 받습니다.
const usePostArticleLike = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = [QueryKeys.articleList, userId];

  return useMutation<
    PostArticleLikeResponse,
    AxiosError<{ message: string }>,
    number, // mutate 함수에 전달하는 변수 타입 (articleId)
    ArticleLikeMutationContext
  >({
    mutationFn: postArticleLike,

    // 3. onMutate: '좋아요' 클릭 즉시 UI를 업데이트합니다.
    onMutate: async (likedArticleId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousArticleList = queryClient.getQueryData<Article[]>(queryKey);

      queryClient.setQueryData<{ newsResponseList: Article[] }>(queryKey, (oldData) => {
        if (!oldData) return { newsResponseList: [] };
        return {
          newsResponseList: oldData.newsResponseList.map((article) =>
            article.id === likedArticleId
              ? {
                  ...article,
                  isLiked: true, // '좋아요' 상태를 true로 변경
                  likeCount: (article.likeCount ?? 0) + 1, // '좋아요' 수를 1 증가
                }
              : article,
          ),
        };
      });

      return { previousArticleList };
    },

    // 4. onError: 실패 시 이전 상태로 롤백합니다.
    onError: (err, variables, context) => {
      if (context?.previousArticleList) {
        queryClient.setQueryData<Article[]>(queryKey, context.previousArticleList);
      }
    },
  });
};

export default usePostArticleLike;

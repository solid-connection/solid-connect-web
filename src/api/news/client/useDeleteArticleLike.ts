import { AxiosError, AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { Article } from "@/types/news";

import { useMutation, useQueryClient } from "@tanstack/react-query";

// Article 타입에 isLiked, likeCount 속성이 포함되어 있어야 합니다.

interface DeleteArticleLikeResponse {
  isLiked: boolean;
  likeCount: number;
}

// 1. 롤백을 위한 context 타입을 정의합니다.
type ArticleLikeMutationContext = {
  previousArticleList?: { newsResponseList: Article[] };
};

const deleteArticleLike = async (articleId: number): Promise<DeleteArticleLikeResponse> => {
  const response: AxiosResponse<DeleteArticleLikeResponse> = await axiosInstance.delete(`/news/${articleId}/like`);
  return response.data;
};

// 2. 어떤 유저의 목록을 업데이트할지 식별하기 위해 userId를 props로 받습니다.
const useDeleteArticleLike = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = [QueryKeys.articleList, userId];

  return useMutation<
    DeleteArticleLikeResponse,
    AxiosError<{ message: string }>,
    number, // mutate 함수에 전달하는 변수 타입 (articleId)
    ArticleLikeMutationContext
  >({
    mutationFn: deleteArticleLike,

    // 3. onMutate: '좋아요 취소' 클릭 즉시 UI를 업데이트합니다.
    onMutate: async (unlikedArticleId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousArticleList = queryClient.getQueryData<{ newsResponseList: Article[] }>(queryKey);

      queryClient.setQueryData<{ newsResponseList: Article[] }>(queryKey, (oldData) => {
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

    // 4. onError: 실패 시 이전 상태로 롤백합니다.
    onError: (err, variables, context) => {
      if (context?.previousArticleList) {
        queryClient.setQueryData<{ newsResponseList: Article[] }>(queryKey, context.previousArticleList);
      }
    },
  });
};

export default useDeleteArticleLike;

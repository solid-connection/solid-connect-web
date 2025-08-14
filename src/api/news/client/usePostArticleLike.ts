import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PostArticleLikeResponse {
  isLiked: boolean;
  likeCount: number;
}

const postArticleLike = async (articleId: number): Promise<PostArticleLikeResponse> => {
  const response: AxiosResponse<PostArticleLikeResponse> = await axiosInstance.post(`/news/${articleId}/like`);
  return response.data;
};

const usePostArticleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postArticleLike,
    onSuccess: () => {
      // 아티클 목록 쿼리를 무효화하여 새로 고침
      queryClient.invalidateQueries({ queryKey: [QueryKeys.articleList] });
    },
    onError: () => {
      alert("좋아요 처리에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostArticleLike;

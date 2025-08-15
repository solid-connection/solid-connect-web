import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteArticleLikeResponse {
  isLiked: boolean;
  likeCount: number;
}

const deleteArticleLike = async (articleId: number): Promise<DeleteArticleLikeResponse> => {
  const response: AxiosResponse<DeleteArticleLikeResponse> = await axiosInstance.delete(`/news/${articleId}/like`);
  return response.data;
};

const useDeleteArticleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticleLike,
    onSuccess: () => {
      // 아티클 목록 쿼리를 무효화하여 새로 고침
      queryClient.invalidateQueries({ queryKey: [QueryKeys.articleList] });
    },
    onError: () => {
      alert("좋아요 취소에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default useDeleteArticleLike;

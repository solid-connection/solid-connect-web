import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { PostLikeResponse } from "@/types/community";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * @description 게시글 좋아요 API 함수
 * @param postId - 좋아요할 게시글의 ID
 * @returns Promise<PostLikeResponse>
 */
const postLike = async (postId: number): Promise<PostLikeResponse> => {
  const response: AxiosResponse<PostLikeResponse> = await axiosInstance.post(`/posts/${postId}/like`);
  return response.data;
};

/**
 * @description 게시글 좋아요를 위한 useMutation 커스텀 훅
 */
const usePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLike,
    onSuccess: (data, postId) => {
      // 해당 게시글 상세 쿼리를 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({ queryKey: [QueryKeys.posts, postId] });
    },
    onError: (error) => {
      console.error("게시글 좋아요 실패:", error);
      toast.error("좋아요 처리에 실패했습니다.");
    },
  });
};

export default usePostLike;

import { AxiosError } from "axios";

import { CommunityQueryKeys, PostLikeResponse, communityApi } from "./api";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * @description 게시글 좋아요 취소를 위한 useMutation 커스텀 훅
 */
const useDeleteLike = () => {
  const queryClient = useQueryClient();

  return useMutation<PostLikeResponse, AxiosError, number>({
    mutationFn: communityApi.unlikePost,
    onSuccess: (data, postId) => {
      // 해당 게시글 상세 쿼리를 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts, postId] });
    },
    onError: (error) => {
      console.error("게시글 좋아요 취소 실패:", error);
      toast.error("좋아요 취소 처리에 실패했습니다.");
    },
  });
};

export default useDeleteLike;

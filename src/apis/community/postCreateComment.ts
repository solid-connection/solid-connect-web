import { AxiosError } from "axios";

import { CommentCreateRequest, CommentIdResponse, CommunityQueryKeys, communityApi } from "./api";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * @description 댓글 생성을 위한 useMutation 커스텀 훅
 */
const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<CommentIdResponse, AxiosError, CommentCreateRequest>({
    mutationFn: communityApi.createComment,
    onSuccess: (data, variables) => {
      // 해당 게시글 상세 쿼리를 무효화하여 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts, variables.postId] });
      toast.success("댓글이 등록되었습니다.");
    },
    onError: (error) => {
      console.error("댓글 생성 실패:", error);
      toast.error("댓글 등록에 실패했습니다.");
    },
  });
};

export default useCreateComment;

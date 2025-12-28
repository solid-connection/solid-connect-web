import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { communityApi, CommunityQueryKeys, CommentIdResponse } from "./api";
import { toast } from "@/lib/zustand/useToastStore";

interface DeleteCommentRequest {
  commentId: number;
  postId: number;
}

/**
 * @description 댓글 삭제를 위한 useMutation 커스텀 훅
 */
const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<CommentIdResponse, AxiosError, DeleteCommentRequest>({
    mutationFn: ({ commentId }) => communityApi.deleteComment(commentId),
    onSuccess: (data, variables) => {
      // 해당 게시글 상세 쿼리를 무효화하여 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts, variables.postId] });
      toast.success("댓글이 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error);
      toast.error("댓글 삭제에 실패했습니다.");
    },
  });
};

export default useDeleteComment;
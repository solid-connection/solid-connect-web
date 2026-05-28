import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { showIconToast } from "@/lib/toast/showIconToast";
import { type CommentIdResponse, CommunityQueryKeys, communityApi } from "./api";

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
    onSuccess: (_data, variables) => {
      // 해당 게시글 상세 쿼리를 무효화하여 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts, variables.postId] });
      showIconToast("logo", "댓글이 삭제되었습니다.");
    },
  });
};

export default useDeleteComment;

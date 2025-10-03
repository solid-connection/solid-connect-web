import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { CommentIdResponse } from "@/types/community";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteCommentRequest {
  commentId: number;
  postId: number;
}

/**
 * @description 댓글 삭제 API 함수
 * @param commentId - 삭제할 댓글의 ID
 * @returns Promise<CommentIdResponse>
 */
const deleteComment = async (commentId: number): Promise<CommentIdResponse> => {
  const response: AxiosResponse<CommentIdResponse> = await axiosInstance.delete(`/comments/${commentId}`);
  return response.data;
};

/**
 * @description 댓글 삭제를 위한 useMutation 커스텀 훅
 */
const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentRequest) => deleteComment(commentId),
    onSuccess: (data, variables) => {
      // 해당 게시글 상세 쿼리를 무효화하여 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: [QueryKeys.posts, variables.postId] });
      toast.success("댓글이 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error);
      toast.error("댓글 삭제에 실패했습니다.");
    },
  });
};

export default useDeleteComment;

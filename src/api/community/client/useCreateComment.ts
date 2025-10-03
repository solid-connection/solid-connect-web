import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { CommentCreateRequest, CommentIdResponse } from "@/types/community";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * @description 댓글 생성 API 함수
 * @param request - 댓글 생성 요청 데이터
 * @returns Promise<CommentIdResponse>
 */
const createComment = async (request: CommentCreateRequest): Promise<CommentIdResponse> => {
  const response: AxiosResponse<CommentIdResponse> = await axiosInstance.post(`/comments`, request);
  return response.data;
};

/**
 * @description 댓글 생성을 위한 useMutation 커스텀 훅
 */
const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (data, variables) => {
      // 해당 게시글 상세 쿼리를 무효화하여 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: [QueryKeys.posts, variables.postId] });
      toast.success("댓글이 등록되었습니다.");
    },
    onError: (error) => {
      console.error("댓글 생성 실패:", error);
      toast.error("댓글 등록에 실패했습니다.");
    },
  });
};

export default useCreateComment;

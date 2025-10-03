import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/zustand/useToastStore";

/**
 * @description 게시글 삭제 API 응답 타입
 * @property {string} message - 성공 메시지
 * @property {number} postId - 삭제된 게시글 ID
 */
interface DeletePostResponse {
  message: string;
  postId: number;
}

/**
 * @description postId를 받아 해당 게시글을 삭제하는 API 함수
 * @param postId - 삭제할 게시글의 ID
 * @returns Promise<AxiosResponse<DeletePostResponse>>
 */
export const deletePostApi = (postId: number): Promise<AxiosResponse<DeletePostResponse>> => {
  return axiosInstance.delete(`/posts/${postId}`);
};

/**
 * @description 게시글 삭제를 위한 useMutation 커스텀 훅
 */
const useDeletePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    // mutation 실행 시 호출될 함수
    mutationFn: deletePostApi,

    // mutation 성공 시 실행될 콜백
    onSuccess: () => {
      // 'posts' 쿼리 키를 가진 모든 쿼리를 무효화하여
      // 게시글 목록을 다시 불러오도록 합니다.
      // ['posts', 'list'] 등 구체적인 키를 사용하셔도 좋습니다.
      queryClient.invalidateQueries({ queryKey: [QueryKeys.posts] });

      toast.success("게시글이 성공적으로 삭제되었습니다.");

      // 게시글 목록 페이지 이동
      router.replace("/community/FREE");
    },

    // mutation 실패 시 실행될 콜백
    onError: (error) => {
      console.error("게시글 삭제 실패:", error);
      toast.error("게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default useDeletePost;

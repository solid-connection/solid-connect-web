import { useRouter } from "next/navigation";
import { AxiosResponse, AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { communityApi, CommunityQueryKeys, DeletePostResponse } from "./api";
import { toast } from "@/lib/zustand/useToastStore";

/**
 * @description 게시글 삭제를 위한 useMutation 커스텀 훅
 */
const useDeletePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<DeletePostResponse>, AxiosError, number>({
    mutationFn: communityApi.deletePost,
    onSuccess: () => {
      // 'posts' 쿼리 키를 가진 모든 쿼리를 무효화하여
      // 게시글 목록을 다시 불러오도록 합니다.
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts] });

      toast.success("게시글이 성공적으로 삭제되었습니다.");

      // 게시글 목록 페이지 이동
      router.replace("/community/FREE");
    },
    onError: (error) => {
      console.error("게시글 삭제 실패:", error);
      toast.error("게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default useDeletePost;
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { showIconToast } from "@/lib/toast/showIconToast";
import { CommunityQueryKeys, communityApi, type DeletePostResponse } from "./api";

interface DeletePostVariables {
  postId: number;
  boardCode?: string;
}

/**
 * @description 게시글 삭제를 위한 useMutation 커스텀 훅
 */
const useDeletePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<DeletePostResponse>, AxiosError, DeletePostVariables>({
    mutationFn: ({ postId }) => communityApi.deletePost(postId),
    onSuccess: (_result, variables) => {
      // 'posts' 쿼리 키를 가진 모든 쿼리를 무효화하여
      // 게시글 목록을 다시 불러오도록 합니다.
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts] });
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.postList] });

      // 이전에 미리 가져온 목록이 화면 이동 시 다시 적용되지 않도록 갱신합니다.
      router.refresh();

      showIconToast("logo", "게시글이 성공적으로 삭제되었습니다.");

      // 게시글 목록 페이지 이동
      router.replace(`/community/${variables.boardCode || "FREE"}`);
    },
    onError: () => {
      showIconToast("logo", "게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default useDeletePost;

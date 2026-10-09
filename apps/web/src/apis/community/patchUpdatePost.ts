import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { showIconToast } from "@/lib/toast/showIconToast";
import { CommunityQueryKeys, communityApi, type PostIdResponse, type PostUpdateRequest } from "./api";

interface UpdatePostVariables {
  postId: number;
  data: PostUpdateRequest;
}

/**
 * @description 게시글 수정을 위한 useMutation 커스텀 훅
 */
const useUpdatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<PostIdResponse, AxiosError, UpdatePostVariables>({
    mutationFn: ({ postId, data }) => communityApi.updatePost(postId, data),
    onSuccess: (_result, variables) => {
      // 해당 게시글 상세 쿼리와 목록 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts, variables.postId] });
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts] });
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.postList] });

      // 이전에 미리 가져온 목록이 화면 이동 시 다시 적용되지 않도록 갱신합니다.
      router.refresh();

      showIconToast("logo", "게시글이 수정되었습니다.");
    },
  });
};

export default useUpdatePost;

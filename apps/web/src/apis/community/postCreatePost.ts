import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { showIconToast } from "@/lib/toast/showIconToast";
import { CommunityQueryKeys, communityApi, type PostCreateRequest, type PostIdResponse } from "./api";

/**
 * @description 게시글 생성을 위한 useMutation 커스텀 훅
 */
const useCreatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<PostIdResponse & { boardCode: string }, AxiosError, PostCreateRequest>({
    mutationFn: communityApi.createPost,
    onSuccess: () => {
      // 게시글 목록 쿼리를 무효화하여 최신 목록 반영
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts] });
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.postList] });

      // 이전에 미리 가져온 목록이 화면 이동 시 다시 적용되지 않도록 갱신합니다.
      router.refresh();

      showIconToast("logo", "게시글이 등록되었습니다.");
    },
  });
};

export default useCreatePost;

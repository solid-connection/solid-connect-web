import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { CommunityQueryKeys, communityApi, type DeletePostResponse } from "./api";

interface DeletePostVariables {
  postId: number;
  boardCode?: string;
}

/**
 * @description ISR 페이지를 revalidate하는 함수
 * @param boardCode - 게시판 코드
 * @param accessToken - 사용자 인증 토큰
 */
const revalidateCommunityPage = async (boardCode: string, accessToken: string) => {
  try {
    if (!accessToken) {
      console.warn("Revalidation skipped: No access token available");
      return;
    }

    await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ boardCode }),
    });
  } catch (error) {
    console.error("Revalidate failed:", error);
  }
};

/**
 * @description 게시글 삭제를 위한 useMutation 커스텀 훅
 */
const useDeletePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  return useMutation<AxiosResponse<DeletePostResponse>, AxiosError, DeletePostVariables>({
    mutationFn: ({ postId }) => communityApi.deletePost(postId),
    onSuccess: async (_result, variables) => {
      // 'posts' 쿼리 키를 가진 모든 쿼리를 무효화하여
      // 게시글 목록을 다시 불러오도록 합니다.
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts] });

      // ISR 페이지 revalidate
      if (variables.boardCode && accessToken) {
        await revalidateCommunityPage(variables.boardCode, accessToken);
      }

      toast.success("게시글이 성공적으로 삭제되었습니다.");

      // 게시글 목록 페이지 이동
      router.replace(`/community/${variables.boardCode || "FREE"}`);
    },
    onError: (error) => {
      console.error("게시글 삭제 실패:", error);
      toast.error("게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default useDeletePost;

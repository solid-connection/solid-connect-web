import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { CommunityQueryKeys, communityApi, type PostIdResponse, type PostUpdateRequest } from "./api";

interface UpdatePostVariables {
  postId: number;
  data: PostUpdateRequest;
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
 * @description 게시글 수정을 위한 useMutation 커스텀 훅
 */
const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  return useMutation<PostIdResponse, AxiosError, UpdatePostVariables>({
    mutationFn: ({ postId, data }) => communityApi.updatePost(postId, data),
    onSuccess: async (_result, variables) => {
      // 해당 게시글 상세 쿼리와 목록 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts, variables.postId] });
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts] });

      // ISR 페이지 revalidate
      if (variables.boardCode && accessToken) {
        await revalidateCommunityPage(variables.boardCode, accessToken);
      }

      toast.success("게시글이 수정되었습니다.");
    },
    onError: (error) => {
      console.error("게시글 수정 실패:", error);
      toast.error("게시글 수정에 실패했습니다.");
    },
  });
};

export default useUpdatePost;

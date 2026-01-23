import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { CommunityQueryKeys, communityApi, type PostCreateRequest, type PostIdResponse } from "./api";

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
 * @description 게시글 생성을 위한 useMutation 커스텀 훅
 */
const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  return useMutation<PostIdResponse & { boardCode: string }, AxiosError, PostCreateRequest>({
    mutationFn: communityApi.createPost,
    onSuccess: async (data) => {
      // 게시글 목록 쿼리를 무효화하여 최신 목록 반영
      queryClient.invalidateQueries({ queryKey: [CommunityQueryKeys.posts] });

      // ISR 페이지 revalidate (사용자 인증 토큰 사용)
      if (accessToken) {
        await revalidateCommunityPage(data.boardCode, accessToken);
      }

      toast.success("게시글이 등록되었습니다.");
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      toast.error("게시글 등록에 실패했습니다.");
    },
  });
};

export default useCreatePost;

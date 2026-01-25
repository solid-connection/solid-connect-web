import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { toast } from "@/lib/zustand/useToastStore";
import { MentorQueryKeys, mentorApi, type PostApplyMentoringRequest, type PostApplyMentoringResponse } from "./api";

/**
 * @description 멘토링 신청 훅
 */
const usePostApplyMentoring = () => {
  const queryClient = useQueryClient();
  return useMutation<PostApplyMentoringResponse, AxiosError, PostApplyMentoringRequest>({
    mutationFn: mentorApi.postApplyMentoring,
    onSuccess: async () => {
      // 멘토링 신청 후 멘토 목록을 새로고침
      await queryClient.invalidateQueries({ queryKey: [MentorQueryKeys.applyMentoringList] });
    },
    onError: () => {
      toast.error("멘토 신청에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostApplyMentoring;

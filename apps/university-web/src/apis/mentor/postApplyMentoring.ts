import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

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
  });
};

export default usePostApplyMentoring;

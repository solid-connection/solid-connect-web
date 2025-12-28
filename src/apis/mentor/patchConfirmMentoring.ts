import { AxiosError } from "axios";

import { MentorQueryKeys, PatchCheckMentoringsRequest, PatchCheckMentoringsResponse, mentorApi } from "./api";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * @description 멘토 멘토링 확인 처리 훅
 */
const usePatchMentorCheckMentorings = () => {
  const queriesClient = useQueryClient();
  return useMutation<PatchCheckMentoringsResponse, AxiosError, PatchCheckMentoringsRequest>({
    onSuccess: () => {
      // 멘토링 체크 상태 변경 후 멘토링 목록 쿼리 무효화
      Promise.all([
        queriesClient.invalidateQueries({ queryKey: [MentorQueryKeys.mentoringList] }),
        queriesClient.invalidateQueries({ queryKey: [MentorQueryKeys.mentoringNewCount] }),
      ]);
    },
    mutationFn: mentorApi.patchMentorCheckMentorings,
  });
};

export default usePatchMentorCheckMentorings;

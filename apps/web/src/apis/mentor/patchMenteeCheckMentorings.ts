import { AxiosError } from "axios";

import { PatchCheckMentoringsRequest, PatchCheckMentoringsResponse, mentorApi } from "./api";

import { useMutation } from "@tanstack/react-query";

/**
 * @description 멘티 멘토링 확인 처리 훅
 */
const usePatchMenteeCheckMentorings = () => {
  return useMutation<PatchCheckMentoringsResponse, AxiosError, PatchCheckMentoringsRequest>({
    mutationFn: mentorApi.patchMenteeCheckMentorings,
  });
};

export default usePatchMenteeCheckMentorings;

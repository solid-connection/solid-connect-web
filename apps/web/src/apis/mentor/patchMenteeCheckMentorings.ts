import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { mentorApi, type PatchCheckMentoringsRequest, type PatchCheckMentoringsResponse } from "./api";

/**
 * @description 멘티 멘토링 확인 처리 훅
 */
const usePatchMenteeCheckMentorings = () => {
  return useMutation<PatchCheckMentoringsResponse, AxiosError, PatchCheckMentoringsRequest>({
    mutationFn: mentorApi.patchMenteeCheckMentorings,
  });
};

export default usePatchMenteeCheckMentorings;

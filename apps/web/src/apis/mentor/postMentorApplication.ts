import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { mentorApi, type PostMentorApplicationRequest } from "./api";

/**
 * @description 멘토 신청 훅
 */
const usePostMentorApplication = () => {
  return useMutation<void, AxiosError, PostMentorApplicationRequest>({
    mutationFn: mentorApi.postMentorApplication,
  });
};

export default usePostMentorApplication;

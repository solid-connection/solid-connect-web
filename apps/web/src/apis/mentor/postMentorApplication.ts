import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { toast } from "@/lib/zustand/useToastStore";
import { mentorApi, type PostMentorApplicationRequest } from "./api";

/**
 * @description 멘토 신청 훅
 */
const usePostMentorApplication = () => {
  return useMutation<void, AxiosError, PostMentorApplicationRequest>({
    mutationFn: mentorApi.postMentorApplication,
    onError: (_error) => {
      toast.error("멘토 신청에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostMentorApplication;

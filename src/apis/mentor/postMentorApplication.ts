import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { mentorApi, PostMentorApplicationRequest } from "./api";
import { toast } from "@/lib/zustand/useToastStore";

/**
 * @description 멘토 신청 훅
 */
const usePostMentorApplication = () => {
  return useMutation<void, AxiosError, PostMentorApplicationRequest>({
    mutationFn: mentorApi.postMentorApplication,
    onError: (error) => {
      toast.error("멘토 신청에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostMentorApplication;

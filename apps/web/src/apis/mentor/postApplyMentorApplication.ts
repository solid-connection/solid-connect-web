import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { mentorApi, ApplyMentorApplicationResponse, ApplyMentorApplicationRequest } from "./api";

const usePostApplyMentorApplication = () => {
  return useMutation<ApplyMentorApplicationResponse, AxiosError, ApplyMentorApplicationRequest>({
    mutationFn: (data) => mentorApi.postApplyMentorApplication({ data }),
  });
};

export default usePostApplyMentorApplication;
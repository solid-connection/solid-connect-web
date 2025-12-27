import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { mentorApi, ApplyMentoringResponse, ApplyMentoringRequest } from "./api";

const usePostApplyMentoring = () => {
  return useMutation<ApplyMentoringResponse, AxiosError, ApplyMentoringRequest>({
    mutationFn: (data) => mentorApi.postApplyMentoring({ data }),
  });
};

export default usePostApplyMentoring;
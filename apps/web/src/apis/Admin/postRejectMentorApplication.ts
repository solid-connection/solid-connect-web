import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { adminApi, RejectMentorApplicationResponse, RejectMentorApplicationRequest } from "./api";

const usePostRejectMentorApplication = () => {
  return useMutation<RejectMentorApplicationResponse, AxiosError, { mentorApplicationId: string | number; data: RejectMentorApplicationRequest }>({
    mutationFn: (variables) => adminApi.postRejectMentorApplication(variables),
  });
};

export default usePostRejectMentorApplication;
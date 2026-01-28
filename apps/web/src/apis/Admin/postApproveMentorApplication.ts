import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { adminApi, ApproveMentorApplicationResponse, ApproveMentorApplicationRequest } from "./api";

const usePostApproveMentorApplication = () => {
  return useMutation<ApproveMentorApplicationResponse, AxiosError, { mentorApplicationId: string | number; data: ApproveMentorApplicationRequest }>({
    mutationFn: (variables) => adminApi.postApproveMentorApplication(variables),
  });
};

export default usePostApproveMentorApplication;
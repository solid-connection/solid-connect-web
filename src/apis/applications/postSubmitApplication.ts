import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { applicationsApi, SubmitApplicationResponse, SubmitApplicationRequest } from "./api";

const usePostSubmitApplication = () => {
  return useMutation<SubmitApplicationResponse, AxiosError, SubmitApplicationRequest>({
    mutationFn: (data) => applicationsApi.postSubmitApplication({ data }),
  });
};

export default usePostSubmitApplication;
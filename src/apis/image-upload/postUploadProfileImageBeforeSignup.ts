import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { imageUploadApi, UploadProfileImageBeforeSignupResponse, UploadProfileImageBeforeSignupRequest } from "./api";

const usePostUploadProfileImageBeforeSignup = () => {
  return useMutation<UploadProfileImageBeforeSignupResponse, AxiosError, UploadProfileImageBeforeSignupRequest>({
    mutationFn: (data) => imageUploadApi.postUploadProfileImageBeforeSignup({ data }),
  });
};

export default usePostUploadProfileImageBeforeSignup;
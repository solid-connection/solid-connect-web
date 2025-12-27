import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { authApi, EmailVerificationResponse, EmailVerificationRequest } from "./api";

const usePostEmailVerification = () => {
  return useMutation<EmailVerificationResponse, AxiosError, EmailVerificationRequest>({
    mutationFn: (data) => authApi.postEmailVerification({ data }),
  });
};

export default usePostEmailVerification;
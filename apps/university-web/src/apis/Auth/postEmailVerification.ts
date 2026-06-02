import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { authApi, type EmailSignUpRequest, type EmailSignUpResponse } from "./api";

/**
 * @description 이메일 회원가입을 위한 useMutation 커스텀 훅
 */
const usePostEmailSignUp = () => {
  return useMutation<EmailSignUpResponse, AxiosError, EmailSignUpRequest>({
    mutationFn: (data) => authApi.postEmailSignUp(data),
  });
};

export default usePostEmailSignUp;

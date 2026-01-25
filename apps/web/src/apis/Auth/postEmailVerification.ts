import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { toast } from "@/lib/zustand/useToastStore";
import { authApi, type EmailSignUpRequest, type EmailSignUpResponse } from "./api";

/**
 * @description 이메일 회원가입을 위한 useMutation 커스텀 훅
 */
const usePostEmailSignUp = () => {
  return useMutation<EmailSignUpResponse, AxiosError, EmailSignUpRequest>({
    mutationFn: (data) => authApi.postEmailSignUp(data),
    onError: (error) => {
      console.error("이메일 회원가입 실패:", error);
      toast.error("회원가입에 실패했습니다.");
    },
  });
};

export default usePostEmailSignUp;

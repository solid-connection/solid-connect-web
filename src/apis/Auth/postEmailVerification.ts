import { AxiosError } from "axios";

import { authApi, EmailSignUpResponse, EmailSignUpRequest } from "./api";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation } from "@tanstack/react-query";

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
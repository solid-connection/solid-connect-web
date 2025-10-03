import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

import { EmailSignUpRequest, EmailSignUpResponse } from "@/types/auth";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation } from "@tanstack/react-query";

/**
 * @description 이메일 회원가입 API 함수
 * @param request - 이메일 회원가입 요청 데이터
 * @returns Promise<EmailSignUpResponse>
 */
const emailSignUp = async (request: EmailSignUpRequest): Promise<EmailSignUpResponse> => {
  const response: AxiosResponse<EmailSignUpResponse> = await publicAxiosInstance.post("/auth/email/sign-up", request);
  return response.data;
};

/**
 * @description 이메일 회원가입을 위한 useMutation 커스텀 훅
 */
const usePostEmailSignUp = () => {
  return useMutation({
    mutationFn: emailSignUp,
    onError: (error) => {
      console.error("이메일 회원가입 실패:", error);
      toast.error("회원가입에 실패했습니다.");
    },
  });
};

export default usePostEmailSignUp;

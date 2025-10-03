import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

import { SignUpRequest, SignUpResponse } from "@/types/auth";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation } from "@tanstack/react-query";

/**
 * @description 회원가입 API 함수
 * @param request - 회원가입 요청 데이터
 * @returns Promise<SignUpResponse>
 */
const signUp = async (signUpRequest: SignUpRequest): Promise<SignUpResponse> => {
  // 임시 성별, 생년월일 추가. API 변경 시 삭제
  const payload = {
    ...signUpRequest,
    birth: "2000-01-01",
    gender: "PREFER_NOT_TO_SAY",
  };

  const response: AxiosResponse<SignUpResponse> = await publicAxiosInstance.post("/auth/sign-up", payload);
  return response.data;
};

/**
 * @description 회원가입을 위한 useMutation 커스텀 훅
 */
const usePostSignUp = () => {
  return useMutation({
    mutationFn: signUp,
    onError: (error) => {
      console.error("회원가입 실패:", error);
      toast.error("회원가입에 실패했습니다.");
    },
  });
};

export default usePostSignUp;

import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { toast } from "@/lib/zustand/useToastStore";
import { authApi, type SignUpRequest, type SignUpResponse } from "./api";

/**
 * @description 회원가입을 위한 useMutation 커스텀 훅
 */
const usePostSignUp = () => {
  return useMutation<SignUpResponse, AxiosError, SignUpRequest>({
    mutationFn: (data) => authApi.postSignUp(data),
    onError: (error) => {
      console.error("회원가입 실패:", error);
      toast.error("회원가입에 실패했습니다.");
    },
  });
};

export default usePostSignUp;

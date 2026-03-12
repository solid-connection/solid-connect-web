import { useMutation } from "@tanstack/react-query";

import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { authApi, type EmailLoginRequest, type EmailLoginResponse } from "./api";

/**
 * @description 이메일 로그인을 위한 useMutation 커스텀 훅
 */
const usePostEmailAuth = () => {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();

  return useMutation<EmailLoginResponse, AxiosError, EmailLoginRequest>({
    mutationFn: (data) => authApi.postEmailLogin(data),
    onSuccess: (data) => {
      const { accessToken } = data;

      // Zustand persist가 자동으로 localStorage에 저장
      // refreshToken은 서버에서 HTTP-only 쿠키로 자동 설정됨
      setAccessToken(accessToken);

      toast.success("로그인에 성공했습니다.");

      // Zustand persist middleware가 localStorage에 저장할 시간을 보장
      // 토큰 저장 후 리다이렉트하여 타이밍 이슈 방지
      setTimeout(() => {
        router.push("/");
      }, 100);
    },
  });
};

export default usePostEmailAuth;

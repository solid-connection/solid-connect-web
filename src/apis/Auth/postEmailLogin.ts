import { useRouter, useSearchParams } from "next/navigation";

import { AxiosError } from "axios";

import { validateSafeRedirect } from "@/utils/authUtils";

import { EmailLoginRequest, EmailLoginResponse, authApi } from "./api";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { useMutation } from "@tanstack/react-query";

/**
 * @description 이메일 로그인을 위한 useMutation 커스텀 훅
 */
const usePostEmailAuth = () => {
  const { setAccessToken } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  return useMutation<EmailLoginResponse, AxiosError, EmailLoginRequest>({
    mutationFn: (data) => authApi.postEmailLogin(data),
    onSuccess: (data) => {
      const { accessToken } = data;

      // Zustand persist가 자동으로 localStorage에 저장
      // refreshToken은 서버에서 HTTP-only 쿠키로 자동 설정됨
      setAccessToken(accessToken);

      // 안전한 리다이렉트 처리 - 오픈 리다이렉트 방지
      const redirectParam = searchParams.get("redirect");
      const safeRedirect = validateSafeRedirect(redirectParam);

      toast.success("로그인에 성공했습니다.");
      router.replace(safeRedirect);
    },
  });
};

export default usePostEmailAuth;

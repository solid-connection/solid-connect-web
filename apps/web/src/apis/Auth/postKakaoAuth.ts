import { useMutation } from "@tanstack/react-query";

import type { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { validateSafeRedirect } from "@/utils/authUtils";
import { authApi, type KakaoAuthRequest, type KakaoAuthResponse } from "./api";

/**
 * @description 카카오 로그인을 위한 useMutation 커스텀 훅
 */
const usePostKakaoAuth = () => {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation<KakaoAuthResponse, AxiosError, KakaoAuthRequest>({
    mutationFn: (data) => authApi.postKakaoAuth(data),
    onSuccess: (data) => {
      if (data.isRegistered) {
        // 기존 회원일 시 - Zustand persist가 자동으로 localStorage에 저장
        // refreshToken은 서버에서 HTTP-only 쿠키로 자동 설정됨
        setAccessToken(data.accessToken);

        // 안전한 리다이렉트 처리 - 오픈 리다이렉트 방지
        const redirectParam = searchParams.get("redirect");
        const safeRedirect = validateSafeRedirect(redirectParam);

        toast.success("로그인에 성공했습니다.");

        setTimeout(() => {
          router.push(safeRedirect);
        }, 100);
      } else {
        // 새로운 회원일 시 - 회원가입 페이지로 이동
        router.push(`/sign-up?token=${data.signUpToken}`);
      }
    },
    onError: () => {
      toast.error("카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      router.push("/login");
    },
  });
};

export default usePostKakaoAuth;

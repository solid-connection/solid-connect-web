import { useMutation } from "@tanstack/react-query";

import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { buildSignUpPath, getCommunityRedirectOrFallback } from "@/utils/authRedirect";
import { type AuthRedirectOptions, authApi, type KakaoAuthRequest, type KakaoAuthResponse } from "./api";

/**
 * @description 카카오 로그인을 위한 useMutation 커스텀 훅
 */
const usePostKakaoAuth = ({ redirectPath }: AuthRedirectOptions = {}) => {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();

  return useMutation<KakaoAuthResponse, AxiosError, KakaoAuthRequest>({
    mutationFn: (data) => authApi.postKakaoAuth(data),
    onSuccess: (data) => {
      if (data.isRegistered) {
        // 기존 회원일 시 - Zustand persist가 자동으로 localStorage에 저장
        // refreshToken은 서버에서 HTTP-only 쿠키로 자동 설정됨
        setAccessToken(data.accessToken);

        showIconToast("logo", "로그인에 성공했습니다.");
        setTimeout(() => {
          router.push(getCommunityRedirectOrFallback(redirectPath));
        }, 100);
      } else {
        // 새로운 회원일 시 - 회원가입 페이지로 이동
        router.push(buildSignUpPath({ signUpToken: data.signUpToken, redirectPath }));
      }
    },
    onError: () => {
      router.push("/login");
    },
  });
};

export default usePostKakaoAuth;

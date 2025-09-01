import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { getTokenExpirationSeconds, setIsPrevLoginCookie } from "@/utils/authCookieUtils";
import { isCookieLoginEnabled } from "@/utils/authUtils";
import { publicAxiosInstance } from "@/utils/axiosInstance";
import { saveAccessTokenToLS } from "@/utils/localStorageUtils";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { useMutation } from "@tanstack/react-query";

interface UsePostEmailSignInResponse {
  accessToken: string;
  refreshToken: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

const postEmailAuth = ({ email, password }: LoginRequest): Promise<AxiosResponse<UsePostEmailSignInResponse>> =>
  publicAxiosInstance.post("/auth/email/sign-in", { email, password });

const usePostEmailAuth = () => {
  const router = useRouter();
  const { setAccessToken } = useAuthStore();
  return useMutation({
    mutationFn: postEmailAuth,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;

      // 액세스 토큰은 항상 Zustand 스토어에 저장
      setAccessToken(accessToken);

      // isPrevLogin 쿠키 설정 (성능 최적화를 위해)
      const expirationSeconds = getTokenExpirationSeconds(accessToken);
      if (expirationSeconds && expirationSeconds > 0) {
        setIsPrevLoginCookie(expirationSeconds);
      } else {
        // 토큰 파싱에 실패한 경우 기본값으로 1시간 설정
        setIsPrevLoginCookie(3600); // 1 hour
      }

      // 로컬스토리지 모드일 때만 리프레시 토큰을 로컬스토리지에 저장
      // 쿠키 모드일 때는 서버에서 HTTP-only 쿠키로 자동 설정됨
      if (!isCookieLoginEnabled() && refreshToken) {
        saveAccessTokenToLS(refreshToken);
      }

      router.replace("/"); // 로그인 성공 후 홈으로 리다이렉트
    },
    onError: () => {
      alert("이메일 또는 비밀번호가 올바르지 않습니다. 다시 시도해주세요.");
    },
  });
};
export default usePostEmailAuth;

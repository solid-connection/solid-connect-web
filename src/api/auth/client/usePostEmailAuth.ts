import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";
import { saveRefreshTokenToLS } from "@/utils/localStorageUtils";

import { setAccessToken } from "@/lib/zustand/useTokenStore";
import { useMutation } from "@tanstack/react-query";

interface UsePostEmailSignInResponse {
  accessToken: string;
  refreshToken: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// 쿠키 로그인 활성화 여부 확인
const isCookieLoginEnabled = () => {
  return process.env.NEXT_PUBLIC_COOKIE_LOGIN_ENABLED === "true";
};

const postEmailAuth = ({ email, password }: LoginRequest): Promise<AxiosResponse<UsePostEmailSignInResponse>> =>
  publicAxiosInstance.post("/auth/email/sign-in", { email, password });

const usePostEmailAuth = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: postEmailAuth,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;

      // 액세스 토큰은 항상 Zustand 스토어에 저장
      setAccessToken(accessToken);

      // 로컬스토리지 모드일 때만 리프레시 토큰을 로컬스토리지에 저장
      // 쿠키 모드일 때는 서버에서 HTTP-only 쿠키로 자동 설정됨
      if (!isCookieLoginEnabled() && refreshToken) {
        saveRefreshTokenToLS(refreshToken);
      }

      router.replace("/"); // 로그인 성공 후 홈으로 리다이렉트
    },
    onError: (error) => {
      alert("이메일 또는 비밀번호가 올바르지 않습니다. 다시 시도해주세요.");
    },
  });
};
export default usePostEmailAuth;

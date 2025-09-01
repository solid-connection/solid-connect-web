import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { isCookieLoginEnabled } from "@/utils/authUtils";
import { publicAxiosInstance } from "@/utils/axiosInstance";
import { saveAccessTokenToLS } from "@/utils/localStorageUtils";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { useMutation } from "@tanstack/react-query";

// Apple
export interface RegisteredAppleAuthResponse {
  isRegistered: true;
  accessToken: string;
  refreshToken: string;
}

export interface UnregisteredAppleAuthResponse {
  isRegistered: false;
  nickname: null;
  email: string;
  profileImageUrl: null;
  signUpToken: string;
}

interface AppleAuthRequest {
  code: string;
}

type AppleAuthResponse = RegisteredAppleAuthResponse | UnregisteredAppleAuthResponse;

const postAppleAuth = ({ code }: AppleAuthRequest): Promise<AxiosResponse<AppleAuthResponse>> =>
  publicAxiosInstance.post("/auth/apple", { code });

const usePostAppleAuth = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: postAppleAuth,
    onSuccess: (response) => {
      const { data } = response;

      if (data.isRegistered) {
        // 기존 회원일 시 - 토큰 저장하고 홈으로 이동
        useAuthStore.getState().setAccessToken(data.accessToken);

        // 로컬스토리지 모드일 때만 리프레시 토큰을 로컬스토리지에 저장
        if (!isCookieLoginEnabled() && data.refreshToken) {
          saveAccessTokenToLS(data.refreshToken);
        }

        router.push("/");
      } else {
        // 새로운 회원일 시 - 회원가입 페이지로 이동
        router.push(`/sign-up?token=${data.signUpToken}`);
      }
    },
    onError: (error) => {
      alert("애플 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      router.push("/login");
    },
  });
};

export default usePostAppleAuth;

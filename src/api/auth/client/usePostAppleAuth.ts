import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
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
        // 기존 회원일 시 - Zustand persist가 자동으로 localStorage에 저장
        // refreshToken은 서버에서 HTTP-only 쿠키로 자동 설정됨
        useAuthStore.getState().setAccessToken(data.accessToken);
      } else {
        // 새로운 회원일 시 - 회원가입 페이지로 이동
        router.push(`/sign-up?token=${data.signUpToken}`);
      }
    },
    onError: () => {
      toast.error("애플 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      router.push("/login");
    },
  });
};

export default usePostAppleAuth;

import { useMutation } from "@tanstack/react-query";

import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { type AppleAuthRequest, type AppleAuthResponse, authApi } from "./api";

/**
 * @description 애플 로그인을 위한 useMutation 커스텀 훅
 */
const usePostAppleAuth = () => {
  const router = useRouter();

  return useMutation<AppleAuthResponse, AxiosError, AppleAuthRequest>({
    mutationFn: (data) => authApi.postAppleAuth(data),
    onSuccess: (data) => {
      if (data.isRegistered) {
        // 기존 회원일 시 - Zustand persist가 자동으로 localStorage에 저장
        // refreshToken은 서버에서 HTTP-only 쿠키로 자동 설정됨
        useAuthStore.getState().setAccessToken(data.accessToken);

        toast.success("로그인에 성공했습니다.");

        setTimeout(() => {
          router.push("/");
        }, 100);
      } else {
        // 새로운 회원일 시 - 회원가입 페이지로 이동
        router.push(`/sign-up?token=${data.signUpToken}`);
      }
    },
    onError: () => {
      router.push("/login");
    },
  });
};

export default usePostAppleAuth;

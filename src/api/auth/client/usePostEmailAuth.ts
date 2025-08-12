import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

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

const postEmailAuth = ({ email, password }: LoginRequest): Promise<AxiosResponse<UsePostEmailSignInResponse>> =>
  publicAxiosInstance.post("/auth/email/sign-in", { email, password });

const usePostEmailAuth = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: postEmailAuth,
    onSuccess: (data) => {
      const { accessToken } = data.data;
      setAccessToken(accessToken);
      router.replace("/"); // 로그인 성공 후 홈으로 리다이렉트
    },
    onError: (error) => {
      alert("이메일 또는 비밀번호가 올바르지 않습니다. 다시 시도해주세요.");
    },
  });
};
export default usePostEmailAuth;

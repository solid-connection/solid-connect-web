import { AxiosError } from "axios";

import { SignOutResponse, authApi } from "./api";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * @description 로그아웃을 위한 useMutation 커스텀 훅
 */
const usePostLogout = () => {
  const { clearAccessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<SignOutResponse, AxiosError, void>({
    mutationFn: () => authApi.postSignOut(),
    onSuccess: () => {
      // Zustand persist가 자동으로 localStorage에서 제거
      clearAccessToken();
      queryClient.clear();
      // 로그아웃 후 홈으로 리다이렉트
      window.location.href = "/";
    },
  });
};

export default usePostLogout;

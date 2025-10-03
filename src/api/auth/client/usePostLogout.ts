import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";
import { removeAccessTokenToLS } from "@/utils/localStorageUtils";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const postLogout = (): Promise<AxiosResponse<null>> => axiosInstance.post("/auth/sign-out");

const usePostLogout = () => {
  const { clearAccessToken } = useAuthStore();
  const queryClient = useQueryClient(); // 쿼리 캐시 관리를 위해 클라이언트 인스턴스를 가져옵니다.

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      clearAccessToken();
      removeAccessTokenToLS();
      queryClient.clear();
      // 로그아웃 후 홈으로 리다이렉트
      window.location.href = "/";
    },
  });
};

export default usePostLogout;

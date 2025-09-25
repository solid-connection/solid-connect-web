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
    onError: (error) => {
      // 네트워크 오류 등으로 로그아웃 요청이 실패했을 경우를 대비한 처리입니다.
      alert("로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default usePostLogout;

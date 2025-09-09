import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { removeIsPrevLoginCookie } from "@/utils/authCookieUtils";
import { isCookieLoginEnabled } from "@/utils/authUtils";
import { axiosInstance } from "@/utils/axiosInstance";
import { removeAccessTokenToLS } from "@/utils/localStorageUtils";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const postLogout = (): Promise<AxiosResponse<null>> => axiosInstance.post("/auth/sign-out");

const usePostLogout = () => {
  const router = useRouter();
  const { clearAccessToken } = useAuthStore();
  const queryClient = useQueryClient(); // 쿼리 캐시 관리를 위해 클라이언트 인스턴스를 가져옵니다.

  return useMutation({
    mutationFn: postLogout,
    onMutate: () => {
      // 낙관적 업데이트: 로그아웃 요청이 시작되면 바로 로그인 상태를 false로 변경합니다.
      router.replace("/");
    },
    onSuccess: () => {
      clearAccessToken();
      removeIsPrevLoginCookie(); // isPrevLogin 쿠키 제거
      removeAccessTokenToLS();
      queryClient.clear();
    },
    onError: (error) => {
      // 네트워크 오류 등으로 로그아웃 요청이 실패했을 경우를 대비한 처리입니다.
      console.error("Logout failed:", error);
      alert("로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default usePostLogout;

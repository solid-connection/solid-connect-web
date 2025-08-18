import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";
import { removeRefreshTokenFromLS } from "@/utils/localStorageUtils";

import { clearAccessToken } from "@/lib/zustand/useTokenStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const postLogout = (): Promise<AxiosResponse<null>> => axiosInstance.post("/auth/sign-out");

const usePostLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient(); // 쿼리 캐시 관리를 위해 클라이언트 인스턴스를 가져옵니다.

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      // 1. Zustand에 저장된 액세스 토큰을 제거합니다.
      clearAccessToken();

      // 2. 로컬 스토리지에 저장된 리프레시 토큰을 제거합니다.
      removeRefreshTokenFromLS();

      // 3. React Query에 캐싱된 모든 데이터를 제거합니다.
      //    이전 사용자의 정보가 남아있지 않도록 캐시를 완전히 초기화합니다.
      queryClient.clear();

      // 4. 홈 페이지로 리디렉션합니다.
      router.replace("/");
    },
    onError: (error) => {
      // 네트워크 오류 등으로 로그아웃 요청이 실패했을 경우를 대비한 처리입니다.
      console.error("Logout failed:", error);
      alert("로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default usePostLogout;

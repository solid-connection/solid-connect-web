import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";
import { removeAccessTokenToLS } from "@/utils/localStorageUtils";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteUserAccount = (): Promise<AxiosResponse<null>> => axiosInstance.delete("/auth/quit");

const useDeleteUserAccount = () => {
  const router = useRouter();
  const { clearAccessToken } = useAuthStore();
  const queryClient = useQueryClient(); // 쿼리 캐시 관리를 위해 클라이언트 인스턴스를 가져옵니다.

  return useMutation({
    mutationFn: deleteUserAccount,
    onMutate: () => {
      // 낙관적 업데이트: 로그아웃 요청이 시작되면 바로 로그인 상태를 false로 변경합니다.
      router.replace("/");
    },
    onSuccess: () => {
      clearAccessToken();
      removeAccessTokenToLS();
      queryClient.clear();
    },
    onError: (error) => {
      toast.error("회원탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default useDeleteUserAccount;

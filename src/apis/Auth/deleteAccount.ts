import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { type AccountResponse, authApi } from "./api";

/**
 * @description 회원탈퇴를 위한 useMutation 커스텀 훅
 */
const useDeleteUserAccount = () => {
  const router = useRouter();
  const { clearAccessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<AccountResponse, AxiosError, void>({
    mutationFn: () => authApi.deleteAccount(),
    onMutate: () => {
      // 낙관적 업데이트: 요청이 시작되면 바로 홈으로 이동
      router.replace("/");
    },
    onSuccess: () => {
      // Zustand persist가 자동으로 localStorage에서 제거
      clearAccessToken();
      queryClient.clear();
    },
    onError: () => {
      toast.error("회원탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default useDeleteUserAccount;

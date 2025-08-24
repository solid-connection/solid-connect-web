import { useRouter } from "next/navigation";

import { AxiosError } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";
import { removeRefreshTokenFromLS } from "@/utils/localStorageUtils";

import { QueryKeys } from "./queryKey";

import { clearAccessToken } from "@/lib/zustand/useTokenStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UseMyMentorProfileRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

const patchMyPassword = async (data: UseMyMentorProfileRequest): Promise<void> => {
  const res = await axiosInstance.patch<void>("/my/password", data, {});
  return res.data;
};

const usePatchMyPassword = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: [QueryKeys.myInfo, "patch"],
    mutationFn: patchMyPassword,

    onSuccess: () => {
      clearAccessToken();
      removeRefreshTokenFromLS();
      queryClient.clear();

      alert("프로필이 성공적으로 수정되었습니다.");
      router.replace("/");
    },
    onError: (error) => {
      const errorMessage = (error as AxiosError<{ message: string }>).response?.data?.message;
      alert(errorMessage || "프로필 수정에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePatchMyPassword;

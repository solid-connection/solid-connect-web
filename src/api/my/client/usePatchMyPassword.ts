import { useRouter } from "next/navigation";

import { AxiosError } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/zustand/useToastStore";

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
  const { clearAccessToken } = useAuthStore();

  return useMutation<void, AxiosError<{ message: string }>, UseMyMentorProfileRequest>({
    mutationKey: [QueryKeys.myInfo, "password", "patch"],
    mutationFn: patchMyPassword,
    onSuccess: () => {
      clearAccessToken();
      queryClient.clear();
      toast.success("프로필이 성공적으로 수정되었습니다.");
      router.replace("/");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage || "비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePatchMyPassword;

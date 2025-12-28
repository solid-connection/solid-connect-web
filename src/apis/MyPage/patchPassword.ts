import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myPageApi, PasswordPatchRequest } from "./api";
import { QueryKeys } from "../queryKeys";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";

const usePatchMyPassword = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearAccessToken } = useAuthStore();

  return useMutation<void, AxiosError<{ message: string }>, PasswordPatchRequest>({
    mutationKey: [QueryKeys.MyPage.password, "patch"],
    mutationFn: (data) => myPageApi.patchPassword(data),
    onSuccess: () => {
      clearAccessToken();
      queryClient.clear();
      toast.success("비밀번호가 성공적으로 변경되었습니다.");
      router.replace("/");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage || "비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePatchMyPassword;
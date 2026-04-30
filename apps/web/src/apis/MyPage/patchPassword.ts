import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { QueryKeys } from "../queryKeys";
import { myPageApi, type PasswordPatchRequest } from "./api";

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
  });
};

export default usePatchMyPassword;

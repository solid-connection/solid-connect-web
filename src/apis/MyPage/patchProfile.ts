import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myPageApi, ProfilePatchRequest } from "./api";
import { QueryKeys } from "../queryKeys";
import { toast } from "@/lib/zustand/useToastStore";

const usePatchMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, ProfilePatchRequest>({
    mutationKey: [QueryKeys.MyPage.profile, "patch"],
    mutationFn: (data) => myPageApi.patchProfile(data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.MyPage.profile],
      });
    },
    onSuccess: () => {
      toast.success("프로필이 성공적으로 수정되었습니다.");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage || "프로필 수정에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePatchMyInfo;
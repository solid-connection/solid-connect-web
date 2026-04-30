import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { QueryKeys } from "../queryKeys";
import { myPageApi, type ProfilePatchRequest } from "./api";

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
  });
};

export default usePatchMyInfo;

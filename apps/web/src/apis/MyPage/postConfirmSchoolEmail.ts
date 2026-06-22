import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { QueryKeys } from "../queryKeys";
import { myPageApi, type SchoolEmailConfirmPostRequest } from "./api";

const usePostConfirmSchoolEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, SchoolEmailConfirmPostRequest>({
    mutationKey: [QueryKeys.MyPage.schoolEmail, "confirm"],
    mutationFn: (data) => myPageApi.postConfirmSchoolEmail(data),
    meta: SKIP_GLOBAL_ERROR_TOAST_META,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.MyPage.profile],
      });
    },
  });
};

export default usePostConfirmSchoolEmail;

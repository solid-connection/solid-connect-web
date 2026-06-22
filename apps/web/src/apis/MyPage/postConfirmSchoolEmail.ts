import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { postReissueToken } from "@/apis/Auth";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { QueryKeys } from "../queryKeys";
import { myPageApi, type SchoolEmailConfirmPostRequest } from "./api";

const usePostConfirmSchoolEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, SchoolEmailConfirmPostRequest>({
    mutationKey: [QueryKeys.MyPage.schoolEmail, "confirm"],
    mutationFn: (data) => myPageApi.postConfirmSchoolEmail(data),
    meta: SKIP_GLOBAL_ERROR_TOAST_META,
    onSuccess: async () => {
      try {
        await postReissueToken();
      } catch {
        // 학교 인증은 이미 완료되었으므로 토큰 갱신 실패가 성공 흐름을 막지 않게 합니다.
      }

      queryClient.invalidateQueries({
        queryKey: [QueryKeys.MyPage.profile],
      });
    },
  });
};

export default usePostConfirmSchoolEmail;

import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { QueryKeys } from "../queryKeys";
import { myPageApi, type SchoolEmailPostRequest } from "./api";

const usePostSchoolEmail = () => {
  return useMutation<void, AxiosError<{ message: string }>, SchoolEmailPostRequest>({
    mutationKey: [QueryKeys.MyPage.schoolEmail, "post"],
    mutationFn: (data) => myPageApi.postSchoolEmail(data),
    meta: SKIP_GLOBAL_ERROR_TOAST_META,
  });
};

export default usePostSchoolEmail;

import { useMutation } from "@tanstack/react-query";

import type { AxiosError } from "axios";

import { showIconToast } from "@/lib/toast/showIconToast";
import { reportsApi, type UsePostReportsRequest } from "./api";

/**
 * @description 신고 등록 훅
 */
const usePostReports = () => {
  return useMutation<void, AxiosError<{ message: string }>, UsePostReportsRequest>({
    mutationFn: reportsApi.postReport,
    onSuccess: () => {
      showIconToast("logo", "신고가 성공적으로 등록되었습니다.");
    },
  });
};

export default usePostReports;

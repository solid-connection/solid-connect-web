import { useMutation } from "@tanstack/react-query";

import type { AxiosError } from "axios";

import { toast } from "react-hot-toast";
import { reportsApi, type UsePostReportsRequest } from "./api";

/**
 * @description 신고 등록 훅
 */
const usePostReports = () => {
  return useMutation<void, AxiosError<{ message: string }>, UsePostReportsRequest>({
    mutationFn: reportsApi.postReport,
    onSuccess: () => {
      toast.success("신고가 성공적으로 등록되었습니다.");
    },
  });
};

export default usePostReports;

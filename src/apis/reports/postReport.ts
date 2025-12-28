import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { reportsApi, UsePostReportsRequest } from "./api";
import { toast } from "@/lib/zustand/useToastStore";

/**
 * @description 신고 등록 훅
 */
const usePostReports = () => {
  const router = useRouter();
  return useMutation<void, AxiosError<{ message: string }>, UsePostReportsRequest>({
    mutationFn: reportsApi.postReport,
    onSuccess: () => {
      toast.success("신고가 성공적으로 등록되었습니다.");
      router.back();
    },
    onError: (error) => {
      toast.error("신고 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default usePostReports;
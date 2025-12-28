import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { ReportType } from "@/types/reports";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation } from "@tanstack/react-query";

interface UsePostReportsRequest {
  targetType: "POST"; // 지금은 게시글 신고 기능만 존재
  targetId: number; // 신고하려는 리소스의 ID
  reportType: ReportType; // Docs 참고
}

const postReports = async (body: UsePostReportsRequest): Promise<void> => {
  const response: AxiosResponse<void> = await axiosInstance.post(`/reports`, body);
  return response.data;
};

const usePostReports = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: postReports,
    onSuccess: () => {
      toast.success("신고가 성공적으로 등록되었습니다.");
      router.back(); // 신고 후 뒤로 이동
    },
    onError: (error) => {
      toast.error("신고 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default usePostReports;

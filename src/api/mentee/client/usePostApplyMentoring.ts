import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UsePostApplyMentoringRequest {
  mentorId: number;
}
interface UsePostApplyMentoringResponse {
  mentoringId: number;
}

const postApplyMentoring = async (body: UsePostApplyMentoringRequest): Promise<UsePostApplyMentoringResponse> => {
  const res = await axiosInstance.post<UsePostApplyMentoringResponse>("/mentee/mentorings", body);
  return res.data;
};

const usePostApplyMentoring = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postApplyMentoring,
    onSuccess: async () => {
      // 멘토링 신청 후 멘토 목록을 새로고침
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.applyMentoringList] });
    },
    onError: () => {
      toast.error("멘토 신청에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostApplyMentoring;

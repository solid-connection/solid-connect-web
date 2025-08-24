import { useRouter } from "next/navigation";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconCheck } from "@/public/svgs/mentor";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postApplyMentoring,
    onSuccess: async () => {
      // 멘토링 신청 후 멘토 목록을 새로고침
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.applyMentoringList] });
      const ok = await customConfirm({
        title: "멘토 신청",
        content: "멘토 신청이 완료되었습니다.",
        icon: IconCheck,
        rejectMessage: "홈으로",
        approveMessage: "다른 멘토 찾기",
      });
      if (ok) {
        router.push("/mentor");
        return;
      }
      router.push("/");
    },
    onError: (error) => {
      alert("멘토 신청에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostApplyMentoring;

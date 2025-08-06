import { axiosInstance } from "@/utils/axiosInstance";

import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconCheck } from "@/public/svgs/mentor";
import { useMutation } from "@tanstack/react-query";

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
  return useMutation({
    mutationFn: postApplyMentoring,
    onSuccess: () => {
      customConfirm({
        title: "멘티 신청이 완료되었어요!",
        content: "멘토가 신청을 수락하면 대화를 시작할 수 있어요.\n대화 수락까지 조금만 기다려주세요.",
        icon: IconCheck as string,
        rejectMessage: "홈으로",
        approveMessage: "다른 멘토 찾기",
      });
    },
  });
};

export default usePostApplyMentoring;

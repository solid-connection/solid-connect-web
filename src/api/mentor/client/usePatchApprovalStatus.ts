import { useRouter } from "next/navigation";

import { axiosInstance } from "@/utils/axiosInstance";

import { MentoringApprovalStatus } from "@/types/mentor";

import { customAlert } from "@/lib/zustand/useAlertModalStore";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconUnSmile } from "@/public/svgs/mentor";
import { useMutation } from "@tanstack/react-query";

interface UsePatchApprovalStatusRequest {
  approveStatus: MentoringApprovalStatus;
}
interface UsePatchApprovalStatusResponse {
  mentoringId: number; // 멘토링 ID
}

const patchApprovalStatus = async (body: UsePatchApprovalStatusRequest): Promise<UsePatchApprovalStatusResponse> => {
  const res = await axiosInstance.patch<UsePatchApprovalStatusResponse>("/mentor/mentorings/check", body);
  return res.data;
};

const usePatchApprovalStatus = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: patchApprovalStatus,
    onSuccess: async (data, variables) => {
      if (variables.approveStatus === MentoringApprovalStatus.REJECT) {
        customAlert({
          title: "멘티 신청을 거절했어요.",
          icon: IconUnSmile,
          content: "현재까지 누적해서 거절했어요. 누적 5회 거절 시 활동에 제약이 있으니 유의해주세요.",
          buttonText: "닫기",
        });
      } else if (variables.approveStatus === MentoringApprovalStatus.APPROVE) {
        const ok = await customConfirm({
          title: "멘티 신청이 완료되었어요!",
          content: "지금 바로 멘티에게 메시지를 전송해보세요",
          icon: IconUnSmile,
          rejectMessage: "닫기",
          approveMessage: "1:1 채팅 바로가기",
        });
        if (ok) {
          router.push(`/chat/${data.mentoringId}`);
        }
      }
    },
    onError: (error) => {
      customAlert({
        title: "멘토링 상태 변경 실패",
        content: "멘토링 상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.",
        buttonText: "확인",
      });
    },
  });
};

export default usePatchApprovalStatus;

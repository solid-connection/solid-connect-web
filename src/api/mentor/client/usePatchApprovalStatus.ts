import { useRouter } from "next/navigation";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { MentoringApprovalStatus } from "@/types/mentor";

import { customAlert } from "@/lib/zustand/useAlertModalStore";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconSmile, IconUnSmile } from "@/public/svgs/mentor";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UsePatchApprovalStatusRequest {
  status: MentoringApprovalStatus;
  mentoringId: number; // 멘토링 ID
}
interface UsePatchApprovalStatusResponse {
  mentoringId: number; // 멘토링 ID
  chatRoomId: number; // 채팅방 ID
}

const patchApprovalStatus = async (props: UsePatchApprovalStatusRequest): Promise<UsePatchApprovalStatusResponse> => {
  const { status, mentoringId } = props;
  const res = await axiosInstance.patch<UsePatchApprovalStatusResponse>(`/mentor/mentorings/${mentoringId}`, {
    status,
  });
  return res.data;
};

const usePatchApprovalStatus = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchApprovalStatus,
    onSuccess: async (data, variables) => {
      // 멘토링 상태 변경 후 쿼리 무효화
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKeys.mentoringList] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.mentoringNewCount] }),
      ]);

      if (variables.status === MentoringApprovalStatus.REJECTED) {
        customAlert({
          title: "멘티 신청을 거절했어요.",
          icon: IconUnSmile,
          content: "현재까지 누적해서 거절했어요. 누적 5회 거절 시 활동에 제약이 있으니 유의해주세요.",
          buttonText: "닫기",
        });
      } else if (variables.status === MentoringApprovalStatus.APPROVED) {
        const ok = await customConfirm({
          title: "멘티 신청이 완료되었어요!",
          content: "지금 바로 멘티에게 메시지를 전송해보세요",
          icon: IconSmile,
          rejectMessage: "닫기",
          approveMessage: "1:1 채팅 바로가기",
        });
        if (ok) {
          router.push(`/mentor/chat/${data.chatRoomId}`);
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

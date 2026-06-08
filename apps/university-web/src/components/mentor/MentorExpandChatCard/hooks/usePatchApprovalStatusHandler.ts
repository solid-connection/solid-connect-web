import { usePatchApprovalStatus } from "@/apis/mentor";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconUnSmile } from "@/public/svgs/mentor";
import { MentoringApprovalStatus } from "@/types/mentor";

const usePatchApprovalStatusHandler = () => {
  const { mutate: patchApprovalStatus } = usePatchApprovalStatus();

  const handleAccept = (mentoringId: number) => {
    patchApprovalStatus({ status: MentoringApprovalStatus.APPROVED, mentoringId });
  };

  const handleReject = async (mentoringId: number) => {
    const ok = await customConfirm({
      title: "멘티 신청을 정말 거절하시겠어요?",
      content: "누적 5회 거절 시 멘토 활동에 제약이 있을 수 있어요. 다시 한 번 고민해보세요.",
      icon: IconUnSmile,
      approveMessage: "다시 생각해볼게요",
      rejectMessage: "그래도 거절할래요",
    });
    if (ok) return;
    patchApprovalStatus({ status: MentoringApprovalStatus.REJECTED, mentoringId });
  };

  return { handleAccept, handleReject };
};

export default usePatchApprovalStatusHandler;

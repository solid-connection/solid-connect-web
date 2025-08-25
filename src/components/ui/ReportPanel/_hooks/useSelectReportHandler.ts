import { useState } from "react";

import { reportReasons } from "@/constants/report";
import { ReasonType } from "@/types/reports";

import usePostReports from "@/api/reports/client/usePostReport";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconReport } from "@/public/svgs/mentor";

interface UseSelectReportHandlerReturn {
  selectedReason: ReasonType | null;
  handleReasonSelect: (reason: ReasonType) => Promise<void>;
}

const useSelectReportHandler = (chatId: number): UseSelectReportHandlerReturn => {
  const [selectedReason, setSelectedReason] = useState<ReasonType | null>(null);
  const { mutate: postReports } = usePostReports();

  const handleReasonSelect = async (reason: ReasonType) => {
    setSelectedReason(reason);
    const ok = await customConfirm({
      title: "신고 확인",
      content: `선택한 신고 사유:${reportReasons[reason]}`,
      approveMessage: "신고하기",
      rejectMessage: "취소",
      icon: IconReport,
    });
    if (ok) {
      postReports({
        targetType: "POST",
        targetId: chatId,
        reasonType: reason,
      });
    } else {
      setSelectedReason(null);
    }
  };
  return { selectedReason, handleReasonSelect };
};
export default useSelectReportHandler;

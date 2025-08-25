import { useState } from "react";

import { reportReasons } from "@/constants/report";
import { ReportType } from "@/types/reports";

import usePostReports from "@/api/reports/client/usePostReport";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconReport } from "@/public/svgs/mentor";

interface UseSelectReportHandlerReturn {
  selectedReason: ReportType | null;
  handleReasonSelect: (reason: ReportType) => Promise<void>;
}

const useSelectReportHandler = (chatId: number): UseSelectReportHandlerReturn => {
  const [selectedReason, setSelectedReason] = useState<ReportType | null>(null);
  const { mutate: postReports } = usePostReports();

  const handleReasonSelect = async (reason: ReportType) => {
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
        reportType: reason,
      });
    } else {
      setSelectedReason(null);
    }
  };
  return { selectedReason, handleReasonSelect };
};
export default useSelectReportHandler;

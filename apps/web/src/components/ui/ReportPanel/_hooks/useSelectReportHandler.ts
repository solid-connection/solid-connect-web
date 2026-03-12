import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { usePostReports } from "@/apis/reports";
import { postBlockUser } from "@/apis/users";
import { reportReasons } from "@/constants/report";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import useReportedPostsStore from "@/lib/zustand/useReportedPostsStore";
import { toast } from "@/lib/zustand/useToastStore";
import { IconReport } from "@/public/svgs/mentor";
import type { ReportType } from "@/types/reports";

interface UseSelectReportHandlerReturn {
  selectedReason: ReportType | null;
  handleReasonSelect: (reason: ReportType) => Promise<void>;
}

interface UseSelectReportHandlerOptions {
  blockUserId?: number;
}

const useSelectReportHandler = (
  chatId: number,
  { blockUserId }: UseSelectReportHandlerOptions = {},
): UseSelectReportHandlerReturn => {
  const [selectedReason, setSelectedReason] = useState<ReportType | null>(null);
  const { mutateAsync: postReports } = usePostReports();
  const { mutateAsync: blockUser } = postBlockUser();
  const addBlockedUser = useReportedPostsStore((state) => state.addBlockedUser);
  const removeBlockedUser = useReportedPostsStore((state) => state.removeBlockedUser);
  const addReportedPost = useReportedPostsStore((state) => state.addReportedPost);
  const pathname = usePathname();
  const router = useRouter();

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
      try {
        await postReports({
          targetType: "POST",
          targetId: chatId,
          reportType: reason,
        });

        if (pathname.startsWith("/community/")) {
          addReportedPost(chatId);

          if (blockUserId) {
            addBlockedUser(blockUserId);

            try {
              await blockUser({
                blockedId: blockUserId,
                data: {},
              });
            } catch {
              removeBlockedUser(blockUserId);
              toast.error("사용자 차단에 실패했습니다. 다시 시도해주세요.");
              return;
            }
          }
        }

        router.back();
      } catch {
        setSelectedReason(null);
      }
    } else {
      setSelectedReason(null);
    }
  };
  return { selectedReason, handleReasonSelect };
};
export default useSelectReportHandler;

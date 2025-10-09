"use client";

import Link from "next/link";

import { convertISODateToKoreanTime } from "@/utils/datetimeUtils";

import usePatchApprovalStatusHandler from "@/components/mentor/MentorExpandChatCard/hooks/usePatchApprovalStatusHandler";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import useExpandCardClickHandler from "./hooks/useExpandCardClickHandler";

import { MentoringApplyStatus } from "@/types/mentor";

import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

interface MentorExpandChatCardProps {
  isChecked?: boolean;
  verifyStatus?: MentoringApplyStatus;
  profileImageUrl?: string | null;
  mentoringId: number;
  message: string;
  nickname: string;
  date?: string;
  lastElementRef?: (node: HTMLDivElement | null) => void;
}

const MentorExpandChatCard = ({
  isChecked,
  verifyStatus,
  profileImageUrl,
  message,
  nickname,
  mentoringId,
  date = "",
  lastElementRef,
}: MentorExpandChatCardProps) => {
  const { isExpanded, isCheckedState, handleExpandClick } = useExpandCardClickHandler({
    mentoringId,
    initChecked: isChecked,
  });
  const { handleAccept, handleReject } = usePatchApprovalStatusHandler();

  return (
    <div className="w-full overflow-hidden border-b border-k-50" ref={lastElementRef}>
      <button className="flex w-full items-start gap-3 p-4" onClick={handleExpandClick}>
        {/* Profile Image */}
        <div className="relative h-10 w-10 flex-shrink-0">
          <ProfileWithBadge profileImageUrl={profileImageUrl} width={40} height={40} />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col items-start justify-start self-start">
          <div className="text-left font-normal text-gray-900">
            <span className="font-medium">{nickname}</span>
            {message}
          </div>
        </div>

        {/* Unread Count & Expand Icon */}
        <div className="flex flex-shrink-0 flex-col">
          {/* Date */}
          <div>{date && <span className="text-xs text-gray-500">{convertISODateToKoreanTime(date)}</span>}</div>
          {/* Unread indicator & Expand icon */}
          <div className="flex justify-between gap-2">
            {!isCheckedState ? (
              <div className="h-2 w-2 rounded-full bg-secondary"></div>
            ) : (
              <div className="h-2 w-2"></div>
            )}
            <div className="h-5 w-5">{isExpanded ? <IconDirectionUp /> : <IconDirectionDown />}</div>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="mt-3 flex justify-center">
            {/* TODO mentoringId -> roomID */}
            {verifyStatus === MentoringApplyStatus.APPROVED ? (
              mentoringId ? (
                <Link
                  href={`/mentor/chat/${mentoringId}`}
                  className="rounded-full bg-primary-1 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-2"
                >
                  멘토링 시작하기
                </Link>
              ) : (
                <button
                  disabled
                  className="cursor-not-allowed rounded-full bg-gray-300 px-6 py-2 text-sm font-medium text-white"
                >
                  멘토링 ID 없음
                </button>
              )
            ) : verifyStatus === MentoringApplyStatus.PENDING ? (
              <div className="flex w-full justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(mentoringId);
                  }}
                  className="w-1/3 rounded-full border border-secondary bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  거절하기
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccept(mentoringId);
                  }}
                  className="w-1/3 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  수락하기
                </button>
              </div>
            ) : (
              <div className="flex w-full justify-center">
                <div className="text-k-7000 font-mediu rounded-full bg-primary-200 px-4 py-2 text-sm">
                  거절되었습니다
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorExpandChatCard;

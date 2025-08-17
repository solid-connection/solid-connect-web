"use client";

import Link from "next/link";
import { useState } from "react";

import { convertISODateToKoreanTime } from "@/utils/datetimeUtils";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

/* eslint-disable @typescript-eslint/no-unused-vars */
// 확장 가능한 카드 타입
interface ExpandableChatCardProps {
  hasExpand: true;
  isChecked?: boolean;
  profileImageUrl?: string | null;
  mentoringId?: number;
  message: string;
  nickname: string;
  date?: string;
  // 수락/거절 기능을 위한 추가 props
  showApprovalButtons?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

// 확장 불가능한 카드 타입
interface NonExpandableChatCardProps {
  hasExpand: false;
  profileImageUrl?: string | null;
  mentoringId: number;
  message: string;
  nickname: string;
  // isChecked, date, patchCheckMentorings는 사용 불가
  // 수락/거절 기능을 위한 추가 props
  showApprovalButtons?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}
/* eslint-enable @typescript-eslint/no-unused-vars */

type MentorExpandChatCardProps = ExpandableChatCardProps | NonExpandableChatCardProps;

const MentorExpandChatCard = ({
  hasExpand,
  profileImageUrl,
  message,
  nickname,
  mentoringId,
  ...props
}: MentorExpandChatCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 타입 가드: hasExpand가 true인 경우에만 확장 관련 props 사용
  const isChecked = hasExpand ? (props as ExpandableChatCardProps).isChecked : undefined;
  const date = hasExpand ? (props as ExpandableChatCardProps).date || "" : "";

  // 공통으로 사용 가능한 props
  const showApprovalButtons = props.showApprovalButtons || false;
  const onAccept = props.onAccept;
  const onReject = props.onReject;

  return (
    <div className="w-full overflow-hidden border-b border-k-50">
      <button
        className="flex w-full items-start gap-3 p-4"
        onClick={() => {
          if (hasExpand) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
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
          {/* 1 */}
          <div>
            {hasExpand && date && <span className="text-xs text-gray-500">{convertISODateToKoreanTime(date)}</span>}
          </div>
          {/* 2,3 */}
          <div className="flex justify-between gap-2">
            {hasExpand && !isChecked ? (
              <div className="h-2 w-2 rounded-full bg-secondary"></div>
            ) : (
              <div className="h-2 w-2"></div>
            )}
            {hasExpand && <div className="h-5 w-5">{isExpanded ? <IconDirectionUp /> : <IconDirectionDown />}</div>}
          </div>
        </div>
      </button>

      {/* Expanded Content - hasExpand가 true일 때만 표시 */}
      {hasExpand && isExpanded && (
        <div className="px-4 pb-4">
          <div className="mt-3 flex justify-center">
            {showApprovalButtons ? (
              // 수락/거절 버튼 모드
              <div className="flex w-full justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject?.();
                  }}
                  className="w-1/3 rounded-full border border-secondary bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  거절하기
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAccept?.();
                  }}
                  className="w-1/3 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  수락하기
                </button>
              </div>
            ) : // 기존 멘토링 시작하기 버튼 모드
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorExpandChatCard;

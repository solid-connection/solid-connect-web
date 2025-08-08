"use client";

import Link from "next/link";
import { useState } from "react";

import { convertISODateToKoreanTime } from "@/utils/datetimeUtils";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

/* eslint-disable @typescript-eslint/no-unused-vars */
// 확장 가능한 카드 타입
interface ExpandableChatCardProps {
  hasExpend: true;
  isChecked?: boolean;
  profileImageUrl?: string | null;
  mentoringId?: number;
  message: string;
  nickname: string;
  date?: string;
  patchCheckMentorings?: (payload: { checkedMentoringIds: number[] }) => void;
}

// 확장 불가능한 카드 타입
interface NonExpandableChatCardProps {
  hasExpend: false;
  profileImageUrl?: string | null;
  mentoringId?: number;
  message: string;
  nickname: string;
  // isChecked, date, patchCheckMentorings는 사용 불가
}
/* eslint-enable @typescript-eslint/no-unused-vars */

type MentorExpandChatCardProps = ExpandableChatCardProps | NonExpandableChatCardProps;

const MentorExpandChatCard = ({
  hasExpend,
  profileImageUrl,
  message,
  nickname,
  mentoringId,
  ...props
}: MentorExpandChatCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 타입 가드: hasExpend가 true인 경우에만 확장 관련 props 사용
  const isChecked = hasExpend ? (props as ExpandableChatCardProps).isChecked : undefined;
  const date = hasExpend ? (props as ExpandableChatCardProps).date || "" : "";
  const patchCheckMentorings = hasExpend ? (props as ExpandableChatCardProps).patchCheckMentorings : undefined;

  return (
    <div className="w-full overflow-hidden border-b border-k-50">
      <button
        className="flex w-full items-center gap-3 p-4"
        onClick={() => {
          if (hasExpend) {
            setIsExpanded(!isExpanded);
            if (patchCheckMentorings && !isChecked && mentoringId) {
              patchCheckMentorings({ checkedMentoringIds: [mentoringId] });
            }
          }
        }}
      >
        {/* Profile Image */}
        <div className="relative h-12 w-12 flex-shrink-0">
          <ProfileWithBadge profileImageUrl={profileImageUrl} width={54} height={54} />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col items-start">
          {hasExpend && date && <span className="text-xs text-gray-500">{convertISODateToKoreanTime(date)}</span>}
          <div className="text-left font-normal text-gray-900">
            <span className="font-medium">{nickname}</span>
            {message}
          </div>
        </div>

        {/* Unread Count & Expand Icon */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {/* 안읽은 상태만 - hasExpend가 true일 때만 표시 */}
          {hasExpend && !isChecked && <div className="h-2 w-2 rounded-full bg-secondary"></div>}
          {hasExpend && (
            <div className="h-5 w-5">{!isChecked && (isExpanded ? <IconDirectionUp /> : <IconDirectionDown />)}</div>
          )}
        </div>
      </button>

      {/* Expanded Content - hasExpend가 true일 때만 표시 */}
      {hasExpend && isExpanded && (
        <div className="px-4 pb-4">
          <div className="mt-3 flex justify-center">
            {mentoringId ? (
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

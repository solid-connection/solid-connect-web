"use client";

import { useState } from "react";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

interface MentorExpandChatCardProps {
  isWating: boolean; // true면 대기 중, false면 완료
  profileImageUrl?: string;
  message: string;
  nickname: string;
  date: string;
  onStartMentoring?: () => void;
}

const MentorExpandChatCard = ({
  isWating,
  profileImageUrl,
  message,
  nickname,
  date,
  onStartMentoring,
}: MentorExpandChatCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
    }
  };
  return (
    <div className="w-full overflow-hidden border-b border-k-50">
      <button className="flex w-full items-center gap-3 p-4" onClick={() => setIsExpanded(!isExpanded)}>
        {/* Profile Image */}
        <div className="relative h-12 w-12 flex-shrink-0">
          <ProfileWithBadge profileImageUrl={profileImageUrl} width={54} height={54} />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <span className="text-xs text-gray-500">{formatDate(date)}</span>
          <div className="text-left font-normal text-gray-900">
            <span className="font-medium">{nickname}</span>
            {message}
          </div>
        </div>

        {/* Unread Count & Expand Icon */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {isWating ? (
            <div className="h-2 w-2 rounded-full bg-sub-d-500"></div>
          ) : (
            <div className="h-2 w-2 rounded-full bg-secondary"></div>
          )}
          <div className="h-5 w-5">{!isWating && (isExpanded ? <IconDirectionUp /> : <IconDirectionDown />)}</div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="mt-3 flex justify-center">
            <button
              onClick={onStartMentoring}
              className="rounded-full bg-primary-1 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-2"
            >
              멘토링 시작하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorExpandChatCard;

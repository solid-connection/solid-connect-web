import React from "react";

import { convertISODateToKoreanTime } from "@/utils/datetimeUtils";

import ProfileWithBadge from "../../ui/ProfileWithBadge";

interface MentorChatCardProps {
  profileImageUrl?: string | null;
  nickname: string;
  description: string;
  hasBadge?: boolean;
  time?: string;
}

const MentorChatCard = ({ profileImageUrl, nickname, description, hasBadge = false, time }: MentorChatCardProps) => {
  return (
    <div
      className="mb-2 flex h-16 w-full cursor-pointer items-center gap-3 rounded-lg bg-k-0 px-3 py-4 shadow-sdwB"
      role="button"
      aria-label={`${nickname}와의 채팅`}
    >
      {/* 프로필 이미지 */}
      <ProfileWithBadge profileImageUrl={profileImageUrl} hasBadge={hasBadge} width={40} height={40} />

      {/* 정보 영역 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="mb-1 text-sm font-medium text-gray-900">{nickname}</div>
          {time && (
            <div className="ml-auto whitespace-nowrap text-xs text-k-500">{convertISODateToKoreanTime(time)}</div>
          )}
        </div>

        <div className="truncate text-xs leading-relaxed text-gray-500">{description}</div>
      </div>
    </div>
  );
};

export default MentorChatCard;

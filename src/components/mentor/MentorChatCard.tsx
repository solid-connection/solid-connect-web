import React from "react";

import MentorProfile from "../ui/ProfileWithBadge";

interface MentorChatCardProps {
  profileImageUrl?: string;
  nickname: string;
  description: string;
  hasBadge?: boolean;
}

const MentorChatCard = ({ profileImageUrl, nickname, description, hasBadge = false }: MentorChatCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
    }
  };

  return (
    <div
      className="mb-2 flex h-[66px] w-full cursor-pointer items-center gap-3 rounded-lg bg-k-0 px-3 py-4 shadow-sdwB"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${nickname}와의 채팅`}
    >
      {/* 프로필 이미지 */}
      <MentorProfile profileImageUrl={profileImageUrl} hasBadge={hasBadge} width={40} height={40} />

      {/* 정보 영역 */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-sm font-medium text-gray-900">{nickname}</div>
        <div className="truncate text-xs leading-relaxed text-gray-500">{description}</div>
      </div>
    </div>
  );
};

export default MentorChatCard;

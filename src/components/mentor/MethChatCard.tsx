import React from "react";

import MentoProfile from "./MentoProfile";

interface MethChatCardProps {
  profileImageUrl?: string;
  nickname: string;
  description: string;
  hasBadge?: boolean;
  onClick?: () => void;
}

const MethChatCard: React.FC<MethChatCardProps> = ({
  profileImageUrl,
  nickname,
  description,
  hasBadge = false,
  onClick,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${nickname}와의 채팅`}
    >
      {/* 프로필 이미지 */}
      <MentoProfile profileImageUrl={profileImageUrl} hasBadge={hasBadge} width={40} height={40} />

      {/* 정보 영역 */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-sm font-medium text-gray-900">{nickname}</div>
        <div className="truncate text-xs leading-relaxed text-gray-500">{description}</div>
      </div>
    </div>
  );
};

export default MethChatCard;

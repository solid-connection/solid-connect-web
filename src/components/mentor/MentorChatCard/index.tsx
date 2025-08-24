"use client";

import { memo } from "react";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

interface MentorChatCardProps {
  profileImageUrl?: string | null;
  mentoringId: number;
  message: string;
  nickname: string;
  showApprovalButtons?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

const MentorChatCard = ({
  profileImageUrl,
  message,
  nickname,
  showApprovalButtons = false,
  onAccept,
  onReject,
}: MentorChatCardProps) => {
  return (
    <div className="w-full overflow-hidden border-b border-k-50">
      <div className="flex w-full items-start gap-3 p-4">
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

        {/* Right side content placeholder */}
        <div className="flex flex-shrink-0 flex-col">
          <div className="h-2 w-2"></div>
        </div>
      </div>

      {/* Approval buttons if needed */}
      {showApprovalButtons && (
        <div className="px-4 pb-4">
          <div className="mt-3 flex justify-center">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MentorChatCard);

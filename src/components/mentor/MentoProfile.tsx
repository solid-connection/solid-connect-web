import Image from "next/image";
import React from "react";

import { IconDefaultProfile, IconGraduation } from "@/public/svgs/mentor";

interface MentoProfileProps {
  profileImageUrl?: string;
  hasBadge?: boolean;
  width?: number;
  height?: number;
}

const MentoProfile = ({ profileImageUrl, hasBadge = false, width = 86, height = 86 }: MentoProfileProps) => {
  // 배지 크기를 전체 크기에 비례해서 계산
  const badgeSize = Math.round(width * 0.35);
  const iconSize = Math.round(badgeSize * 0.67);

  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* 프로필 이미지 */}
      <div
        className={`h-full w-full overflow-hidden rounded-full ${
          !hasBadge ? "border-2 border-primary-1" : "border border-gray-200"
        }`}
      >
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt="프로필 이미지"
            width={width}
            height={height}
            className="h-full w-full object-cover"
          />
        ) : (
          <IconDefaultProfile />
        )}
      </div>

      {/* 학습 상태 배지 */}
      {!hasBadge && (
        <div
          className="absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-primary-1"
          style={{ width: `${badgeSize}px`, height: `${badgeSize}px` }}
        >
          <div style={{ width: `${iconSize}px`, height: `${iconSize}px` }}>
            <IconGraduation />
          </div>
        </div>
      )}
    </div>
  );
};

export default MentoProfile;

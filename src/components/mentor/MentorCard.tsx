"use client";

import React, { useState } from "react";

import MentoProfile from "./MentoProfile";

import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

interface Channel {
  type: string;
  url: string;
}

interface Mentor {
  id: number;
  profileImageUrl?: string;
  nickname: string;
  country: string;
  universityName: string;
  studyStatus: string;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  channels: Channel[];
  isApplied: boolean;
}

interface MentorCardProps {
  mentor: Mentor;
  index: number;
}

const MentorCard = ({ mentor, index }: MentorCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 구조분해 할당
  const {
    profileImageUrl,
    hasBadge,
    menteeCount,
    country,
    nickname,
    universityName,
    introduction,
    channels,
    studyStatus,
  } = mentor;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      {/* 멘토 프로필 헤더 */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex flex-col items-center">
          <MentoProfile profileImageUrl={profileImageUrl} hasBadge={hasBadge} />
          <span className="text-xs font-semibold text-primary-1">누적 멘티 {menteeCount}명</span>
        </div>

        <div className="flex-1">
          <span className="text-base font-semibold leading-normal text-primary-1">{country}</span>
          <h3 className="text-xl font-bold leading-normal text-k-800">{nickname}님</h3>
          <div className="mt-1 flex flex-col">
            <p className="text-sm font-medium leading-normal text-k-500">{universityName}</p>
            <span className="text-orange-500">수락 준비 완료</span>
          </div>
        </div>
      </div>

      {/* 확장된 내용 */}
      {isExpanded && (
        <>
          {/* 멘토 한마디 */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-blue-600">멘토 한마디</h4>
            <p className="text-sm leading-relaxed text-gray-700">{introduction}</p>
          </div>

          {/* 멘토 채널 */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-blue-600">멘토 채널</h4>
            <div className="grid grid-cols-2 gap-2">
              {channels.length > 0 ? (
                channels.map((channel, idx) => (
                  <button
                    key={idx}
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                      channel.type === "Blog"
                        ? "bg-green-100 text-green-700"
                        : channel.type === "Brunch"
                          ? "bg-orange-100 text-orange-700"
                          : channel.type === "Instagram"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {channel.type}
                  </button>
                ))
              ) : (
                <>
                  <button className="rounded-lg bg-orange-100 px-3 py-2 text-sm font-medium text-orange-700">
                    Brunch
                  </button>
                  <button className="rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-700">Blog</button>
                  <button className="rounded-lg bg-pink-100 px-3 py-2 text-sm font-medium text-pink-700">
                    Instagram
                  </button>
                  <button className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700">Youtube</button>
                </>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="mb-4 flex gap-2">
            <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white">채소드</button>
            {index > 0 && (
              <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white">덕소드</button>
            )}
          </div>
        </>
      )}

      {/* 접기/펼치기 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={handleToggle}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300"
        >
          <div className="flex h-full w-full items-center justify-center">
            {isExpanded ? <IconDirectionUp /> : <IconDirectionDown />}
          </div>
        </button>
      </div>
    </div>
  );
};

export default MentorCard;

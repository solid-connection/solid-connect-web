"use client";

import React, { useState } from "react";

import MentoProfile from "./MentoProfile";

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
  isExpanded?: boolean;
  onToggleExpansion?: (mentorId: number) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, index, isExpanded = false, onToggleExpansion }) => {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);

  const handleToggle = () => {
    if (onToggleExpansion) {
      onToggleExpansion(mentor.id);
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const expanded = onToggleExpansion ? isExpanded : localExpanded;

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      {/* 멘토 프로필 헤더 */}
      <div className="mb-4 flex items-start gap-3">
        <MentoProfile profileImageUrl={mentor.profileImageUrl} hasBadge={mentor.hasBadge} />
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">{mentor.country}</span>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">{mentor.nickname}</h3>
          <p className="mb-2 text-sm text-gray-600">{mentor.universityName}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-blue-600">누적 멘티 {mentor.menteeCount}명</span>
            <span className="text-orange-500">수락 준비 완료</span>
          </div>
        </div>
      </div>

      {/* 확장된 내용 */}
      {expanded && (
        <>
          {/* 멘토 한마디 */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-blue-600">멘토 한마디</h4>
            <p className="text-sm leading-relaxed text-gray-700">{mentor.introduction}</p>
          </div>

          {/* 멘토 채널 */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-blue-600">멘토 채널</h4>
            <div className="grid grid-cols-2 gap-2">
              {mentor.channels.length > 0 ? (
                mentor.channels.map((channel, idx) => (
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
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MentorCard;

"use client";

import React, { useState } from "react";

import { Link } from "lucide-react";

import ChannelBadge from "@/components/ui/ChannelBadge";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import StudyStatusBox from "../StudyStatusBox";
import MentorApplyPanel from "./ui/MentorApplyPanel";

import { ChannelType, Mentor } from "@/types/mentor";

import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

interface MentorCardProps {
  mentor: Mentor;
  isMine?: boolean; // isMine prop 추가
}

const MentorCard = ({ mentor, isMine = false }: MentorCardProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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

  return (
    <div className="rounded-lg bg-white p-4 shadow-sdwB">
      {/* 멘토 프로필 헤더 */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex flex-col items-center">
          <ProfileWithBadge profileImageUrl={profileImageUrl} hasBadge={hasBadge} />
          <span className="text-xs font-semibold text-primary-1">누적 멘티 {menteeCount}명</span>
        </div>

        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-base font-semibold leading-normal text-primary-1">{country}</span>

            <StudyStatusBox studyStatus={studyStatus} />
          </div>
          <h3 className="text-xl font-bold leading-normal text-k-800">{nickname}님</h3>
          <div className="mt-1 flex flex-col">
            <p className="text-sm font-medium leading-normal text-k-500">{universityName}</p>
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
            <div
              className={`grid gap-2 ${
                channels.length === 1
                  ? "grid-cols-1"
                  : channels.length === 2
                    ? "grid-cols-2"
                    : channels.length === 3
                      ? "grid-cols-2"
                      : "grid-cols-2"
              }`}
            >
              {channels.map((channel, idx) => (
                <div
                  key={idx}
                  className={`h-10 ${channels.length === 1 ? "w-full" : channels.length === 3 && idx === 2 ? "col-span-2" : ""}`}
                >
                  <ChannelBadge channerType={channel.type as ChannelType} />
                </div>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="mb-4 flex items-center justify-center gap-2.5 self-stretch">
            {isMine ? (
              <Link
                href="/mento/modify"
                className="flex h-10 w-[150px] flex-shrink-0 items-center justify-center gap-3 rounded-[20px] bg-primary px-5 py-2.5 font-medium text-white"
              >
                수정하기
              </Link>
            ) : (
              <>
                <button className="flex h-10 w-1/2 flex-shrink-0 items-center justify-center gap-3 rounded-[20px] bg-primary px-5 py-2.5 font-medium text-white">
                  멘토 페이지
                </button>
                <MentorApplyPanel />
              </>
            )}
          </div>
        </>
      )}

      {/* 접기/펼치기 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
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

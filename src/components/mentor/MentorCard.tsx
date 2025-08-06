"use client";

import Link from "next/link";
import React, { useState } from "react";

import clsx from "clsx";

import ChannelBadge from "../ui/ChannelBadge";
import ProfileWithBadge from "../ui/ProfileWithBadge";
import StudyDate from "./StudyDate";

import { ChannelType, MentorCardDetail, MentorCardPreview } from "@/types/mentor";

import usePostApplyMentoring from "@/api/mentee/client/usePostApplyMentoring";
import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

interface MentorCardProps {
  mentor: MentorCardDetail & MentorCardPreview;
  observeRef?: React.RefCallback<HTMLDivElement>;
  isMine?: boolean; // isMine prop 추가
}

const MentorCard = ({ mentor, observeRef, isMine = false }: MentorCardProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { mutate: postApplyMentoring } = usePostApplyMentoring();

  const {
    profileImageUrl,
    hasBadge,
    menteeCount,
    country,
    nickname,
    universityName,
    introduction,
    channels,
    term,
    id,
  } = mentor ?? {};

  const isDetail = !!term;

  return (
    <div
      className="rounded-lg bg-white p-4 shadow-sdwB"
      ref={observeRef} // observeRef를 div에 연결
    >
      {/* 멘토 프로필 헤더 */}
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <ProfileWithBadge profileImageUrl={profileImageUrl} hasBadge={hasBadge} />
          <span className="text-xs font-semibold text-primary-1">누적 멘티 {menteeCount}명</span>
        </div>

        <div className="flex flex-1 flex-col items-stretch gap-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-base font-semibold leading-normal text-primary-1">{country}</span>
            {isDetail && <StudyDate term={term} />}
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
          <div className="mb-4 mt-5">
            <h4 className="mb-2 text-[18px] font-medium text-blue-600">멘토 한마디</h4>
            <p className="text-sm leading-relaxed text-k-500">{introduction}</p>
          </div>

          {/* 멘토 채널 */}
          <div className="mb-4">
            <h4 className="mb-2 text-[18px] font-medium text-blue-600">멘토 채널</h4>
            <div
              className={clsx("grid gap-2", {
                "grid-cols-1": channels.length === 1,
                "grid-cols-2": channels.length >= 2,
              })}
            >
              {channels.map((channel, idx) => (
                <a
                  key={idx}
                  className={`h-10 ${channels.length === 1 ? "w-full" : channels.length === 3 && idx === 2 ? "col-span-2" : ""}`}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ChannelBadge channerType={channel.type as ChannelType} />
                </a>
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
                <Link
                  href={`mentor/${id}`}
                  className="flex h-10 w-1/2 flex-shrink-0 items-center justify-center gap-3 rounded-[20px] bg-primary px-5 py-2.5 font-medium text-white"
                >
                  멘토 페이지
                </Link>
                <button
                  onClick={() => postApplyMentoring({ mentorId: id })}
                  className="flex h-10 w-1/2 flex-shrink-0 items-center justify-center gap-3 rounded-[20px] bg-primary px-5 py-2.5 font-medium text-white"
                >
                  멘티 신청하기
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* 접기/펼치기 버튼 */}
      <div className="mt-1 flex justify-center border-t border-t-k-50 pt-2">
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex h-6 w-6 items-center justify-center">
          {isExpanded ? <IconDirectionUp /> : <IconDirectionDown />}
        </button>
      </div>
    </div>
  );
};

export default MentorCard;

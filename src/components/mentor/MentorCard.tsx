"use client";

import React, { useState } from "react";

import { Link } from "lucide-react";

import IconConfirmCancelModal from "../modal/IconConfirmCancelModal";
import ChannelBadge from "../ui/ChannelBadge";
import ProfileWithBadge from "../ui/ProfileWithBadge";
import StudyStatusBox from "./StudyStatusBox";

import { ChannelType, Mentor } from "@/types/mentor";

import { IconCheck, IconDirectionDown, IconDirectionUp, IconTime } from "@/public/svgs/mentor";

interface MentorCardProps {
  mentor: Mentor;
  isMine?: boolean; // isMine prop 추가
  isDistribute?: boolean; // isDistribute prop 추가
}

const MentorCard = ({ mentor, isMine = false, isDistribute = false }: MentorCardProps) => {
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

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

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
                  className={`h-[40px] ${channels.length === 1 ? "w-full" : channels.length === 3 && idx === 2 ? "col-span-2" : ""}`}
                >
                  <ChannelBadge channerType={channel.type as ChannelType} />
                </div>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="mb-4 flex items-center justify-center gap-[10px] self-stretch">
            {isMine ? (
              <Link
                href="/mento/modify"
                className="flex h-[41px] w-[150px] flex-shrink-0 items-center justify-center gap-3 rounded-[20px] bg-primary px-5 py-[10px] font-medium text-white"
              >
                수정하기
              </Link>
            ) : (
              <>
                <button className="flex h-[41px] w-1/2 flex-shrink-0 items-center justify-center gap-3 rounded-[20px] bg-primary px-5 py-[10px] font-medium text-white">
                  멘토 페이지
                </button>
                <MentoAppliePanel isDistribute={isDistribute} />
              </>
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

const MentoAppliePanel = ({ isDistribute }: { isDistribute: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // isDistribute에 따른 모달 내용 설정
  const modalConfig = isDistribute
    ? {
        icon: <IconTime />,
        title: "지금은 방해금지 시간이에요.",
        content: "방해 금지 시간이 지난 후 멘티 신청을 할 수 있어요.\n내일 아침 다시 신청해주세요.",
      }
    : {
        icon: <IconCheck />,
        title: "멘토 신청이 완료되었어요!",
        content: "멘토가 신청을 수락하면 대화를 시작할 수 있어요.\n대화 수락까지 조금만 기다려주세요.",
      };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex h-[41px] w-1/2 flex-shrink-0 items-center justify-center gap-3 rounded-[20px] bg-primary px-5 py-[10px] font-medium text-white"
      >
        멘토 신청하기
      </button>
      <IconConfirmCancelModal
        icon={modalConfig.icon}
        isOpen={isModalOpen}
        title={modalConfig.title}
        content={modalConfig.content}
        handleCancel={() => setIsModalOpen(false)}
        handleConfirm={() => setIsModalOpen(false)}
        cancelText="홈으로"
        approveText="다른 멘토 찾기"
      />
    </>
  );
};

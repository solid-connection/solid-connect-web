"use client";

import React, { useState } from "react";

import EmptyMentoChatCards from "@/components/mentor/EmptyMentoChatCards";
import MentoChatCard from "@/components/mentor/MentoChatCard";
import MentorDropDown from "@/components/mentor/MentoDropDown";
import MentoFindSection from "@/components/mentor/MentoFindSection";
import MentorCard from "@/components/mentor/MentorCard";

import { ChannelType, Mentor, MentorStudyStatus, MentorTab } from "@/types/mentor";

import { IconDirectionRight } from "@/public/svgs/mentor";

// 임시 데이터 - 실제로는 API에서 가져올 데이터
const mentors: Mentor[] = [
  {
    id: 1,
    profileImageUrl: undefined,
    nickname: "김솔거너",
    country: "미국",
    universityName: "노스캐롤라이나 웨일런대학교(A성)",
    studyStatus: MentorStudyStatus.STUDYING,
    menteeCount: 7,
    hasBadge: true,
    introduction: "안녕하세요! 저는 미국 노스캐롤라이나 웨일런대학교에서 교환학생을 3년간 재학중인 김솔거너입니다!",
    channels: [
      { type: ChannelType.BLOG, url: "https://blog.example.com" },
      { type: ChannelType.BRUNCH, url: "https://brunch.example.com" },
    ],
    isApplied: false,
  },
  {
    id: 2,
    profileImageUrl: undefined,
    nickname: "박솔거너",
    country: "스웨덴",
    universityName: "보라스대학",
    studyStatus: MentorStudyStatus.SCHEDULED,
    menteeCount: 0,
    hasBadge: false,
    introduction: "안녕하세요! 스웨덴 교환학생입니다.",
    channels: [],
    isApplied: false,
  },
  {
    id: 3,
    profileImageUrl: undefined,
    nickname: "정솔거너",
    country: "독일",
    universityName: "푸르트바겐스마르크 경영실무대학교",
    studyStatus: MentorStudyStatus.COMPLETED,
    menteeCount: 7,
    hasBadge: true,
    introduction: "독일 교환학생 경험을 나누고 싶습니다.",
    channels: [],
    isApplied: false,
  },
];

const mentees: Mentor[] = [
  {
    id: 1,
    profileImageUrl: undefined,
    nickname: "윤솔거",
    country: "미국",
    universityName: "안양하세요 교환학생에 대해 무엇이든 물어보세요...",
    studyStatus: MentorStudyStatus.STUDYING,
    menteeCount: 0,
    hasBadge: false,
    introduction: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요!",
    channels: [],
    isApplied: false,
  },
];

const MentorDashBoard = () => {
  const [selectedTab, setSelectedTab] = useState<MentorTab>(MentorTab.MY_MENTOR);

  const handleViewAllClick = () => {
    console.log("전체보기 클릭");
    // 전체보기 페이지로 이동하는 로직
  };

  return (
    <div className="min-h-screen px-4">
      <header className="flex items-center justify-between bg-white p-4">
        <MentorDropDown selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <button onClick={handleViewAllClick} className="flex items-center text-[13px] leading-normal text-k-500">
          전체보기
          <span className="flex h-[20px] w-[20px] items-center justify-center">
            <IconDirectionRight />
          </span>
        </button>
      </header>

      {selectedTab === MentorTab.MY_MENTOR ? (
        <div className="min-h-screen">
          {/* 나의 멘토 섹션 */}
          <div className="mb-10 px-4">
            {mentors.length !== 0 ? (
              <EmptyMentoChatCards message={"나와 매칭된 멘토입니다"} />
            ) : (
              <div>
                {mentors.map((mentor) => (
                  <MentoChatCard
                    key={mentor.id}
                    profileImageUrl={mentor.profileImageUrl}
                    nickname={mentor.nickname}
                    description={mentor.universityName}
                    hasBadge={mentor.hasBadge}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 멘토찾기 섹션 */}
          <MentoFindSection />
        </div>
      ) : (
        <div className="min-h-screen">
          {/* 나의 멘티 탭 */}
          {mentees.length === 0 ? (
            <EmptyMentoChatCards message={"나와 매칭된 멘토입니다"} />
          ) : (
            <>
              {/* 상단 멘티 정보 섹션 */}
              <div className="px-4">
                <MentoChatCard
                  profileImageUrl={mentees[0].profileImageUrl}
                  nickname={mentees[0].nickname}
                  description={mentees[0].universityName}
                  hasBadge={mentees[0].hasBadge}
                />
              </div>

              {/* 나의 멘토 페이지 섹션 */}
              <div className="px-4 py-6">
                <h2 className="text-lg font-bold text-gray-900">나의 멘토 페이지</h2>

                {/* 멘토 카드 */}
                <div className="space-y-4">
                  {mentees.map((mentee) => (
                    <MentorCard key={mentee.id} mentor={mentee} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MentorDashBoard;

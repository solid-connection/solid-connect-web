"use client";

import { useState } from "react";

import EmptyMentoChatCards from "@/components/mentor/EmptyMentoChatCards";
import MentoChatCard from "@/components/mentor/MentoChatCard";

import { ChannelType, MenteeTab, Mentor, MentorStudyStatus } from "@/types/mentor";

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

const getMentoList = () => {
  // 실제로는 API 호출을 통해 멘토 리스트를 가져오는 로직이 필요합니다.
  // 여기서는 임시 데이터를 반환합니다.
  return mentors;
};
const getWatingMentoList = () => {
  // 실제로는 API 호출을 통해 대기 중인 멘토 리스트를 가져오는 로직이 필요합니다.
  // 여기서는 임시 데이터를 반환합니다.
  return mentees;
};

const MenteeWatingMentoringTabs = () => {
  // api
  const mentoList = getMentoList();
  const waitingMentoList = getWatingMentoList();

  // state
  const [selectedTab, setSelectedTab] = useState<MenteeTab>(MenteeTab.MY_MENTOR);

  // 현재 선택된 탭에 따른 데이터와 결정
  const currentData = selectedTab === MenteeTab.MY_MENTOR ? mentoList : waitingMentoList;

  const handleViewAllClick = () => {
    if (selectedTab === MenteeTab.MY_MENTOR) {
      console.log("전체보기 클릭: 진행 중인 멘토링");
      // 전체보기 페이지로 이동하는 로직
    } else {
      console.log("전체보기 클릭: 신청 목록");
      // 전체보기 페이지로 이동하는 로직
    }
  };

  return (
    <>
      <header className="bg-white">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab(MenteeTab.MY_MENTOR)}
            className={`flex-1 py-4 text-center text-base font-medium ${
              selectedTab === MenteeTab.MY_MENTOR ? "border-b-2 border-primary text-primary" : "text-k-500"
            }`}
          >
            나의 멘토
          </button>
          <button
            onClick={() => setSelectedTab(MenteeTab.MY_APPLIED)}
            className={`flex-1 py-4 text-center text-base font-medium ${
              selectedTab === MenteeTab.MY_APPLIED ? "border-b-2 border-primary text-primary" : "text-k-500"
            }`}
          >
            신청 목록
          </button>
        </div>
      </header>

      <div className="flex justify-between">
        <div className="mt-5 flex items-center">
          <h2 className="mr-2 text-lg font-semibold text-k-900">
            {selectedTab === MenteeTab.MY_MENTOR ? "진행 중인 멘토링" : "신청 목록"}
          </h2>
          {currentData.length > 2 && (
            <span className="rounded-2xl bg-primary-1 px-2 text-k-0">{currentData.length - 2}+</span>
          )}
        </div>
        {currentData.length > 2 && (
          <button onClick={handleViewAllClick} className="flex items-center text-[13px] leading-normal text-k-500">
            전체보기
            <span className="flex h-[20px] w-[20px] items-center justify-center">
              <IconDirectionRight />
            </span>
          </button>
        )}
      </div>

      {currentData.length === 0 && (
        <EmptyMentoChatCards
          message={selectedTab === MenteeTab.MY_MENTOR ? "진행중인 멘토링이 없어요!" : "대기중인 멘토링이 없어요!"}
        />
      )}
      {currentData.slice(0, 2).map((mentor) => (
        <MentoChatCard
          key={mentor.id}
          profileImageUrl={mentor.profileImageUrl}
          nickname={mentor.nickname}
          description={mentor.universityName}
          hasBadge={mentor.hasBadge}
        />
      ))}
    </>
  );
};
export default MenteeWatingMentoringTabs;

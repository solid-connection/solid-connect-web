"use client";

import React, { useState } from "react";

import EmptyMentorState from "@/components/layout/EmptyMentorState";
import MentorCard from "@/components/mentor/MentorCard";
import MethChatCard from "@/components/mentor/MethChatCard";

import { IconDirection } from "@/public/svgs/mentor";

// 임시 데이터 - 실제로는 API에서 가져올 데이터
const mentors: Mentor[] = [
  {
    id: 1,
    profileImageUrl: undefined,
    nickname: "김솔거너",
    country: "미국",
    universityName: "노스캐롤라이나 웨일런대학교(A성)",
    studyStatus: "STUDYING_ABROAD",
    menteeCount: 7,
    hasBadge: true,
    introduction: "안녕하세요! 저는 미국 노스캐롤라이나 웨일런대학교에서 교환학생을 3년간 재학중인 김솔거너입니다!",
    channels: [
      { type: "Blog", url: "https://blog.example.com" },
      { type: "Brunch", url: "https://brunch.example.com" },
    ],
    isApplied: false,
  },
  {
    id: 2,
    profileImageUrl: undefined,
    nickname: "박솔거너",
    country: "스웨덴",
    universityName: "보라스대학",
    studyStatus: "STUDYING_ABROAD",
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
    studyStatus: "STUDYING_ABROAD",
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
    studyStatus: "STUDYING_ABROAD",
    menteeCount: 0,
    hasBadge: false,
    introduction: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요!",
    channels: [],
    isApplied: false,
  },
];

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

interface MentorResponse {
  nextPageNumber: number;
  content: Mentor[];
}

export enum MentorTab {
  MY_MENTOR = "나의 멘토",
  MY_MENTEE = "나의 멘티",
}

const MentorDashBoard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<MentorTab>(MentorTab.MY_MENTEE);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTabSelect = (tabValue: MentorTab) => {
    setSelectedTab(tabValue);
    setIsDropdownOpen(false);
  };

  const handleViewAllClick = () => {
    console.log("전체보기 클릭");
    // 전체보기 페이지로 이동하는 로직
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-white p-4">
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center gap-1 text-lg font-medium text-k-900">
            {selectedTab}
            <IconDirection />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 min-w-[120px] rounded-lg border border-gray-200 bg-white shadow-lg">
              <button
                onClick={() => handleTabSelect(MentorTab.MY_MENTEE)}
                className={`block w-full px-4 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 ${
                  selectedTab === MentorTab.MY_MENTEE ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
              >
                {MentorTab.MY_MENTEE}
              </button>
              <button
                onClick={() => handleTabSelect(MentorTab.MY_MENTOR)}
                className={`block w-full px-4 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 ${
                  selectedTab === MentorTab.MY_MENTOR ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
              >
                {MentorTab.MY_MENTOR}
              </button>
            </div>
          )}
        </div>

        <button onClick={handleViewAllClick} className="flex items-center gap-1 text-sm text-gray-600">
          전체보기
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 2L8 6L4 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      {selectedTab === MentorTab.MY_MENTOR ? (
        <div className="min-h-screen bg-gray-50">
          {/* 나의 멘토 섹션 */}
          <div className="px-4 py-6">
            <h2 className="mb-4 text-lg font-bold text-gray-900">나의 멘토</h2>
            <div className="mb-6 flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center">
              <div className="text-gray-500">나와 매칭된 멘토입니다</div>
            </div>
          </div>

          {/* 멘토찾기 섹션 */}
          <div className="px-4 py-6">
            <h2 className="mb-4 text-lg font-bold text-gray-900">멘토 찾기</h2>

            {/* 필터 탭 */}
            <div className="mb-4 flex gap-2">
              <button className="rounded-full bg-blue-500 px-4 py-2 text-sm text-white">전체</button>
              <button className="rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-700">유럽권</button>
              <button className="rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-700">미주권</button>
              <button className="rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-700">아시아권</button>
            </div>

            {/* 멘토 리스트 */}
            <div className="space-y-4">
              {mentors.map((mentor, index) => (
                <MentorCard key={mentor.id} mentor={mentor} index={index} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* 나의 멘티 탭 */}
          {mentees.length === 0 ? (
            <EmptyMentorState message="나와 매칭된 멘티입니다" />
          ) : (
            <>
              {/* 상단 멘티 정보 섹션 */}
              <div className="px-4 py-6">
                <MethChatCard
                  profileImageUrl={mentees[0].profileImageUrl}
                  nickname={mentees[0].nickname}
                  description={mentees[0].universityName}
                  hasBadge={mentees[0].hasBadge}
                  onClick={() => console.log("멘티 채팅 클릭")}
                />
              </div>

              {/* 나의 멘토 페이지 섹션 */}
              <div className="px-4 py-6">
                <h2 className="mb-4 text-lg font-bold text-gray-900">나의 멘토 페이지</h2>

                {/* 멘토 카드 */}
                <div className="space-y-4">
                  {mentees.map((mentee) => (
                    <MentorCard key={mentee.id} mentor={mentee} index={0} />
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

"use client";

import Link from "next/link";
import { useState } from "react";

import MentorChatCard from "@/components/mentor/MentorChatCard";
import EmptyMentorChatCards from "@/components/ui/EmptySdwBCards";

import { VerifyStatus } from "@/types/mentee";
import { MenteeTab } from "@/types/mentor";

import useGetChatRooms from "@/api/chats/clients/useGetChatsRooms";
import useGetMenteeMentoringList from "@/api/mentee/client/useGetMentoringList";
import { IconDirectionRight } from "@/public/svgs/mentor";

const MenteePageTabs = () => {
  // api
  const { data: mentoList = [] } = useGetChatRooms();
  const { data: menteeWatingMentoringList = [] } = useGetMenteeMentoringList(VerifyStatus.PENDING);

  // state
  const [selectedTab, setSelectedTab] = useState<MenteeTab>(MenteeTab.MY_MENTOR);
  // 현재 탭에 따라 보여줄 데이터의 길이
  const currentDataLength = selectedTab === MenteeTab.MY_MENTOR ? mentoList.length : menteeWatingMentoringList.length;

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

      <div className="mb-3 mt-5 flex justify-between">
        <div className="flex items-center">
          <h2 className="mr-2 text-lg font-semibold text-k-900">
            {selectedTab === MenteeTab.MY_MENTOR ? "진행 중인 멘토링" : "대기 중인 멘토링"}
          </h2>
          {currentDataLength > 2 && (
            <span className="rounded-2xl bg-primary-1 px-2 text-k-0">{currentDataLength - 2}+</span>
          )}
        </div>
        {currentDataLength > 2 && (
          <Link
            href={selectedTab === MenteeTab.MY_MENTOR ? "/mentor/my" : "/mentor/apply"}
            className="flex items-center text-[13px] leading-normal text-k-500"
          >
            전체보기
            <span className="flex h-[20px] w-[20px] items-center justify-center">
              <IconDirectionRight />
            </span>
          </Link>
        )}
      </div>

      {currentDataLength === 0 && (
        <EmptyMentorChatCards
          message={selectedTab === MenteeTab.MY_MENTOR ? "진행중인 멘토링이 없어요!" : "대기중인 멘토링이 없어요!"}
        />
      )}

      {selectedTab === MenteeTab.MY_MENTOR &&
        mentoList
          .slice(0, 2)
          .map((mentor) => (
            <MentorChatCard
              key={mentor.id}
              nickname={mentor.partner.nickname}
              profileImageUrl={mentor.partner.profileUrl}
              description={mentor.lastChatMessage}
            />
          ))}
      {selectedTab === MenteeTab.MY_APPLIED &&
        menteeWatingMentoringList
          .slice(0, 2)
          .map((mentor, index) => (
            <MentorChatCard
              key={`MentoChatCard-${index}`}
              profileImageUrl={mentor.profileImageUrl}
              nickname={mentor.nickname}
              description={"안녕하세요! 교환학생에 대해 무엇이든 물어보세요!"}
            />
          ))}

      {/* 중간 밑줄 */}
      <div className="mb-10 mt-10 h-1.5 w-full bg-k-50"></div>
    </>
  );
};
export default MenteePageTabs;

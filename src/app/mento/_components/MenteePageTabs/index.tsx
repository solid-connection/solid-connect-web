"use client";

import { getMenteeListData, getMentorListData } from "@/utils/mockingGetData";

import MentorChatCard from "@/components/mentor/MentorChatCard";
import EmptyMentorChatCards from "@/components/ui/EmptySdwBCards";

import useMenteeHandler from "./_hooks/useSelectTabHandler";

import { MenteeTab } from "@/types/mentor";

import { IconDirectionRight } from "@/public/svgs/mentor";

const MenteePageTabs = () => {
  // api
  const mentoList = getMentorListData();
  const waitingMentoList = getMenteeListData();

  // state
  const { selectedTab, handleTabChange, handleViewAllClick } = useMenteeHandler();

  const currentData = selectedTab === MenteeTab.MY_MENTOR ? mentoList : waitingMentoList;

  return (
    <>
      <header className="bg-white">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange(MenteeTab.MY_MENTOR)}
            className={`flex-1 py-4 text-center text-base font-medium ${
              selectedTab === MenteeTab.MY_MENTOR ? "border-b-2 border-primary text-primary" : "text-k-500"
            }`}
          >
            나의 멘토
          </button>
          <button
            onClick={() => handleTabChange(MenteeTab.MY_APPLIED)}
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
        <EmptyMentorChatCards
          message={selectedTab === MenteeTab.MY_MENTOR ? "진행중인 멘토링이 없어요!" : "대기중인 멘토링이 없어요!"}
        />
      )}
      {currentData.slice(0, 2).map((mentor) => (
        <MentorChatCard
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
export default MenteePageTabs;

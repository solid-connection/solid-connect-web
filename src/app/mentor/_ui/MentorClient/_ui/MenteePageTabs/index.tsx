"use client";

import Link from "next/link";
import { useState } from "react";

import MentorChatCard from "@/components/mentor/MentorChatCard";
import EmptyMentorChatCards from "@/components/ui/EmptySdwBCards";
import TabSelector from "@/components/ui/TabSelector";

import { VerifyStatus } from "@/types/mentee";
import { MenteeTab } from "@/types/mentor";

import useGetChatRooms from "@/api/chat/clients/useGetChatRooms";
import useGetMenteeMentoringList from "@/api/mentee/client/useGetApplyMentoringList";
import { IconDirectionRight } from "@/public/svgs/mentor";

const MenteePageTabs = () => {
  // api
  const { data: mentoList = [] } = useGetChatRooms();
  const { data: menteeWaitingMentoringList = [] } = useGetMenteeMentoringList(VerifyStatus.PENDING);

  // state
  const [selectedTab, setSelectedTab] = useState<MenteeTab>(MenteeTab.MY_MENTOR);
  const tabs = [MenteeTab.MY_MENTOR, MenteeTab.MY_APPLIED];

  // 현재 탭에 따라 보여줄 데이터의 길이
  const currentDataLength = selectedTab === MenteeTab.MY_MENTOR ? mentoList.length : menteeWaitingMentoringList.length;

  return (
    <>
      <header className="">
        <TabSelector tabs={tabs} selectedTab={selectedTab} onTabChange={(tab) => setSelectedTab(tab as MenteeTab)} />
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
            href={selectedTab === MenteeTab.MY_MENTOR ? "/mentor/chat" : "/mentor/waiting"}
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
        mentoList.slice(0, 2).map((mentor) => (
          <Link href={`mentor/chat/${mentor.id}`} key={mentor.id}>
            <MentorChatCard
              key={mentor.id}
              nickname={mentor.partner.nickname}
              profileImageUrl={mentor.partner.profileUrl}
              description={mentor.lastChatMessage}
            />
          </Link>
        ))}
      {selectedTab === MenteeTab.MY_APPLIED &&
        menteeWaitingMentoringList
          .slice(0, 2)
          .map((mentor) => (
            <MentorChatCard
              key={mentor.mentoringId}
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

"use client";

import Link from "next/link";
import React, { useState } from "react";

import MentorChatCard from "@/components/mentor/MentorChatCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";
import TabSelector from "@/components/ui/TabSelector";

import ApplicantListSection from "./_ui/ApplicantListSection";
import MyMentorSection from "./_ui/MyMentorSection";

import { MentorTab } from "@/types/mentor";

import useGetChatRooms from "@/api/chat/clients/useGetChatRooms";
import { IconDirectionRight } from "@/public/svgs/mentor";

const MentorPage = () => {
  const [selectedTab, setSelectedTab] = useState<MentorTab>(MentorTab.MY_MENTEE);
  const isMyMenteeTab = selectedTab === MentorTab.MY_MENTEE;
  const tabs = [MentorTab.MY_MENTEE, MentorTab.APPLY_LIST];

  const { data: myMenteeList = [] } = useGetChatRooms();

  return (
    <>
      <header className="flex items-center justify-between">
        {/* 탭 */}
        <div className="w-full">
          <TabSelector tabs={tabs} selectedTab={selectedTab} onTabChange={(tab) => setSelectedTab(tab as MentorTab)} />
        </div>

        {/* 전체보기 버튼 */}
        {isMyMenteeTab && myMenteeList.length > 2 && (
          <Link href={`/mentor/chat`} className="flex items-center text-[13px] leading-normal text-k-500">
            전체보기
            <span className="flex h-5 w-5 items-center justify-center">
              <IconDirectionRight />
            </span>
          </Link>
        )}
      </header>

      <div className="mb-10 mt-4">
        {/* 멘티 보기 탭일때 */}
        {isMyMenteeTab ? (
          <>
            {myMenteeList.length === 0 ? (
              <EmptySdwBCards message={"나와 매칭된 멘토입니다"} />
            ) : (
              myMenteeList.slice(0, 2).map((mentor) => {
                const { profileUrl, nickname } = mentor.partner;
                return (
                  <Link href={`/mentor/chat/${mentor.id}`} key={mentor.id}>
                    <MentorChatCard
                      key={mentor.id}
                      profileImageUrl={profileUrl}
                      nickname={nickname}
                      description={mentor.lastChatMessage}
                    />
                  </Link>
                );
              })
            )}
            <MyMentorSection />
          </>
        ) : (
          // 멘티 신청 보기 탭일때
          <ApplicantListSection />
        )}
      </div>
    </>
  );
};

export default MentorPage;

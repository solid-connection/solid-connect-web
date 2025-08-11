"use client";

import React, { useState } from "react";

import { Link } from "lucide-react";

import MentoChatCard from "@/components/mentor/MentorChatCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";
import TabSelector from "@/components/ui/TabSelector";

import { MentorTab } from "@/types/mentor";

import useGetChatRooms from "@/api/chats/clients/useGetChatsRooms";
import useGetMentoringList from "@/api/mentor/client/useGetMentoringList";
import { IconDirectionRight } from "@/public/svgs/mentor";

const MentorPageTabs = () => {
  const [selectedTab, setSelectedTab] = useState<MentorTab>(MentorTab.MY_MENTEE);
  const { data: myMenteeList = [] } = useGetChatRooms();
  const { data: mentoringApplicantList = [] } = useGetMentoringList({ size: 3 });

  const selectedCount = selectedTab === MentorTab.MY_MENTEE ? myMenteeList.length : mentoringApplicantList.length;

  const tabs = [MentorTab.APPLY_LIST, MentorTab.MY_MENTEE];

  return (
    <>
      <header className="flex items-center justify-between">
        <header className="">
          <TabSelector tabs={tabs} selectedTab={selectedTab} onTabChange={(tab) => setSelectedTab(tab as MentorTab)} />
        </header>

        {selectedCount > 2 && (
          <Link href={""} className="flex items-center text-[13px] leading-normal text-k-500">
            전체보기
            <span className="flex h-5 w-5 items-center justify-center">
              <IconDirectionRight />
            </span>
          </Link>
        )}
      </header>

      {selectedTab === MentorTab.MY_MENTEE ? (
        <div className="mb-10">
          {myMenteeList.length === 0 ? (
            <EmptySdwBCards message={"나와 매칭된 멘토입니다"} />
          ) : (
            myMenteeList.slice(0, 2).map((mentor) => {
              const { partnerId, profileUrl, nickname } = mentor.partner;
              return (
                <Link href={`/mentor/chat/${partnerId}`} key={partnerId}>
                  <MentoChatCard
                    key={mentor.id}
                    profileImageUrl={profileUrl}
                    nickname={nickname}
                    description={mentor.lastChatMessage}
                  />
                </Link>
              );
            })
          )}
        </div>
      ) : (
        <div className="mb-10">
          {mentoringApplicantList.length === 0 ? (
            <EmptySdwBCards message={"나와 매칭된 멘토입니다"} />
          ) : (
            mentoringApplicantList
              .slice(0, 2)
              .map((mentor) => (
                <MentoChatCard
                  key={mentor.mentoringId}
                  profileImageUrl={mentor.profileImageUrl}
                  nickname={mentor.nickname}
                  description={""}
                />
              ))
          )}
        </div>
      )}
    </>
  );
};

export default MentorPageTabs;

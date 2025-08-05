"use client";

import { useRouter } from "next/router";
import React, { useState } from "react";

import { Link } from "lucide-react";

import { getMenteeListData, getMentorListData } from "@/utils/mockingGetData";

import MentoChatCard from "@/components/mentor/MentorChatCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";

import MentorDropDown from "./_ui/MentorDropDown";

import { MentorTab } from "@/types/mentor";

import { IconDirectionRight } from "@/public/svgs/mentor";

const MentorPageTabs = () => {
  const [selectedTab, setSelectedTab] = useState<MentorTab>(MentorTab.MY_MENTOR);
  const mentorList = getMentorListData();
  const menteeList = getMenteeListData();

  const selectedCount = selectedTab === MentorTab.MY_MENTOR ? mentorList.length : menteeList.length;

  return (
    <>
      <header className="flex items-center justify-between">
        <MentorDropDown selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        {selectedCount > 2 && (
          <Link href={""} className="flex items-center text-[13px] leading-normal text-k-500">
            전체보기
            <span className="flex h-[20px] w-[20px] items-center justify-center">
              <IconDirectionRight />
            </span>
          </Link>
        )}
      </header>

      {selectedTab === MentorTab.MY_MENTOR ? (
        <div className="mb-10">
          {mentorList.length === 0 ? (
            <EmptySdwBCards message={"나와 매칭된 멘토입니다"} />
          ) : (
            mentorList
              .slice(0, 2)
              .map((mentor) => (
                <MentoChatCard
                  key={mentor.id}
                  profileImageUrl={mentor.profileImageUrl}
                  nickname={mentor.nickname}
                  description={mentor.universityName}
                  hasBadge={mentor.hasBadge}
                />
              ))
          )}
        </div>
      ) : (
        <div className="mb-10">
          {menteeList.length === 0 ? (
            <EmptySdwBCards message={"나와 매칭된 멘토입니다"} />
          ) : (
            menteeList
              .slice(0, 2)
              .map((mentor) => (
                <MentoChatCard
                  key={mentor.id}
                  profileImageUrl={mentor.profileImageUrl}
                  nickname={mentor.nickname}
                  description={mentor.universityName}
                  hasBadge={mentor.hasBadge}
                />
              ))
          )}
        </div>
      )}
    </>
  );
};

export default MentorPageTabs;

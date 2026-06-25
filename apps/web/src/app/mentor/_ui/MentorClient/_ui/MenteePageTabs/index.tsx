"use client";

import Link from "next/link";
import { useState } from "react";
import { useGetChatRooms } from "@/apis/chat";
import { useGetApplyMentoringList as useGetMenteeMentoringList } from "@/apis/mentor";
import MentorChatCard from "@/components/mentor/MentorChatCard";
import EmptyMentorChatCards from "@/components/ui/EmptySdwBCards";
import TabSelector from "@/components/ui/TabSelector";
import { IconDirectionRight } from "@/public/svgs/mentor";
import { VerifyStatus } from "@/types/mentee";
import { MenteeTab } from "@/types/mentor";
import { MentorChatCardsSkeleton } from "../../../MentorPageSkeleton";

const MenteePageTabs = ({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) => {
  // api
  const { data: mentoList = [], isPending: isMentoListPending } = useGetChatRooms();
  const { data: menteeWaitingMentoringList = [], isPending: isWaitingListPending } = useGetMenteeMentoringList(
    VerifyStatus.PENDING,
  );

  // state
  const [selectedTab, setSelectedTab] = useState<MenteeTab>(MenteeTab.MY_MENTOR);
  const tabs = [MenteeTab.MY_MENTOR, MenteeTab.MY_APPLIED];
  const isCurrentTabPending = selectedTab === MenteeTab.MY_MENTOR ? isMentoListPending : isWaitingListPending;

  // 현재 탭에 따라 보여줄 데이터의 길이
  const currentDataLength = selectedTab === MenteeTab.MY_MENTOR ? mentoList.length : menteeWaitingMentoringList.length;
  const isDesktop = variant === "desktop";
  const visibleCount = isDesktop ? 4 : 2;
  const sectionTitle = selectedTab === MenteeTab.MY_MENTOR ? "진행 중인 멘토링" : "대기 중인 멘토링";
  const emptyMessage = selectedTab === MenteeTab.MY_MENTOR ? "진행중인 멘토링이 없어요!" : "대기중인 멘토링이 없어요!";
  const viewAllHref = selectedTab === MenteeTab.MY_MENTOR ? "/mentor/chat" : "/mentor/waiting";

  const content = (
    <>
      <header>
        <TabSelector tabs={tabs} selectedTab={selectedTab} onTabChange={(tab) => setSelectedTab(tab as MenteeTab)} />
      </header>

      <div className="mb-3 mt-5 flex justify-between">
        <div className="flex items-center">
          <h2 className="mr-2 text-k-900 typo-sb-5">{sectionTitle}</h2>
          {currentDataLength > visibleCount && (
            <span className="rounded-2xl bg-primary-1 px-2 text-k-0">{currentDataLength - visibleCount}+</span>
          )}
        </div>
        {currentDataLength > visibleCount && (
          <Link href={viewAllHref} className="flex items-center text-k-500 typo-medium-3">
            전체보기
            <span className="flex h-[20px] w-[20px] items-center justify-center">
              <IconDirectionRight />
            </span>
          </Link>
        )}
      </div>

      {isCurrentTabPending ? (
        <MentorChatCardsSkeleton />
      ) : currentDataLength === 0 ? (
        <EmptyMentorChatCards message={emptyMessage} />
      ) : null}

      <div className={isDesktop ? "grid gap-3" : ""}>
        {!isCurrentTabPending &&
          selectedTab === MenteeTab.MY_MENTOR &&
          mentoList.slice(0, visibleCount).map((mentor) => (
            <Link href={`/mentor/chat/${mentor.id}`} key={mentor.id}>
              <MentorChatCard
                key={mentor.id}
                nickname={mentor.partner.nickname}
                profileImageUrl={mentor.partner.profileUrl}
                description={mentor.lastChatMessage || "새로운 멘토링이 시작되었어요!"}
              />
            </Link>
          ))}
        {!isCurrentTabPending &&
          selectedTab === MenteeTab.MY_APPLIED &&
          menteeWaitingMentoringList
            .slice(0, visibleCount)
            .map((mentor) => (
              <MentorChatCard
                key={mentor.mentoringId}
                profileImageUrl={mentor.profileImageUrl}
                nickname={mentor.nickname}
                description={"안녕하세요! 교환학생에 대해 무엇이든 물어보세요!"}
              />
            ))}
      </div>
    </>
  );

  if (isDesktop) {
    return <section className="rounded-lg border border-k-100 bg-white p-6">{content}</section>;
  }

  return (
    <>
      {content}
      <div className="my-8 h-1.5 w-full bg-k-50"></div>
    </>
  );
};
export default MenteePageTabs;

"use client";

import Link from "next/link";
import { useState } from "react";
import { useGetChatRooms } from "@/apis/chat";
import MentorChatCard from "@/components/mentor/MentorChatCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";
import TabSelector from "@/components/ui/TabSelector";
import { IconDirectionRight } from "@/public/svgs/mentor";

import { MentorTab } from "@/types/mentor";
import { MentorChatCardsSkeleton } from "../../../MentorPageSkeleton";
import ApplicantListSection from "./_ui/ApplicantListSection";
import MyMentorSection from "./_ui/MyMentorSection";

const MentorPage = ({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) => {
  const [selectedTab, setSelectedTab] = useState<MentorTab>(MentorTab.MY_MENTEE);
  const isMyMenteeTab = selectedTab === MentorTab.MY_MENTEE;
  const tabs = [MentorTab.MY_MENTEE, MentorTab.APPLY_LIST];

  const { data: myMenteeList = [], isPending: isMyMenteeListPending } = useGetChatRooms();

  const isDesktop = variant === "desktop";

  const menteeListContent = (
    <>
      <header className="flex items-center justify-between">
        <div className="w-full">
          <TabSelector tabs={tabs} selectedTab={selectedTab} onTabChange={(tab) => setSelectedTab(tab as MentorTab)} />
        </div>
      </header>

      <div className={isDesktop ? "mt-4" : "mb-10 mt-4"}>
        <div className="mb-2 flex justify-between">
          <h2 className="text-gray-900 typo-sb-5">나의 멘티</h2>
          {isMyMenteeTab && myMenteeList.length > 2 && (
            <Link href={`/mentor/chat`} className="flex items-center text-k-500 typo-medium-3">
              전체보기
              <span className="flex h-5 w-5 items-center justify-center">
                <IconDirectionRight />
              </span>
            </Link>
          )}
        </div>

        {isMyMenteeTab ? (
          <>
            {isMyMenteeListPending ? (
              <MentorChatCardsSkeleton count={3} />
            ) : myMenteeList.length === 0 ? (
              <EmptySdwBCards message={"나와 매칭된 멘토입니다"} />
            ) : (
              myMenteeList.slice(0, 3).map((mentee) => {
                const { profileUrl, nickname } = mentee.partner;
                return (
                  <Link href={`/mentor/chat/${mentee.id}`} key={mentee.id}>
                    <MentorChatCard
                      profileImageUrl={profileUrl}
                      nickname={nickname}
                      description={mentee.lastChatMessage || "새로운 멘토링이 시작되었어요!"}
                      time={mentee.lastReceivedTime}
                    />
                  </Link>
                );
              })
            )}
            {!isDesktop && (
              <>
                <div className="my-8 h-1.5 w-full bg-k-50"></div>
                <MyMentorSection />
              </>
            )}
          </>
        ) : (
          <ApplicantListSection />
        )}
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
        <header className="mb-8">
          <p className="text-primary typo-sb-9">Mentor</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">멘토 페이지</h1>
          <p className="mt-2 max-w-2xl text-k-500 typo-medium-2">
            멘토링 신청과 나의 멘토 프로필을 한 화면에서 관리하세요.
          </p>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
          <section className="rounded-lg border border-k-100 bg-white p-6">{menteeListContent}</section>
          <section className="rounded-lg border border-k-100 bg-white p-6">
            <MyMentorSection />
          </section>
        </div>
      </div>
    );
  }

  return menteeListContent;
};

export default MentorPage;

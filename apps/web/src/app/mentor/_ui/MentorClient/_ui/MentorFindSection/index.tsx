"use client";

import { useGetMentorList } from "@/apis/mentor";

import MentorCard from "@/components/mentor/MentorCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";
import FloatingUpBtn from "@/components/ui/FloatingUpBtn";
import { FilterTab } from "@/types/mentor";
import useInfinityScroll from "@/utils/useInfinityScroll";
import { MentorCardListSkeleton } from "../../../MentorPageSkeleton";
import usePrefetchMentorFindTab from "./_hooks/usePrefetchMentorFindTab";
import useSelectedTab from "./_hooks/useSelectedTab";

const MentorFindSectionBase = ({ isDesktop }: { isDesktop: boolean }) => {
  const { listRef, selectedTab, handleSelectTab } = useSelectedTab();

  const {
    data: mentorList = [],
    fetchNextPage,
    hasNextPage,
    isPending,
  } = useGetMentorList({
    region: selectedTab !== FilterTab.ALL ? selectedTab : "",
  });
  const { lastElementRef } = useInfinityScroll({ fetchNextPage, hasNextPage });
  usePrefetchMentorFindTab();

  return (
    <section className={isDesktop ? "rounded-lg border border-k-100 bg-white p-6" : ""}>
      <div className={isDesktop ? "mb-5 flex items-start justify-between gap-4" : ""}>
        <div>
          <h2 className="mb-3 text-gray-900 typo-sb-5">멘토 찾기</h2>
          {isDesktop && <p className="text-k-500 typo-medium-3">권역별로 멘토를 탐색하고 멘토링을 신청하세요.</p>}
        </div>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto whitespace-nowrap">
        {Object.values(FilterTab).map((tab) => (
          <button
            key={tab}
            onClick={() => handleSelectTab(tab)}
            className={`flex items-center justify-center gap-[10px] rounded-2xl px-[14px] py-1 text-center leading-[150%] typo-sb-12 ${
              selectedTab === tab ? "bg-primary-100 text-primary" : "bg-k-50 text-k-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div ref={listRef} className={isDesktop ? "grid gap-4 lg:grid-cols-2 2xl:grid-cols-3" : "space-y-4 pb-28"}>
        {isPending ? (
          <MentorCardListSkeleton />
        ) : mentorList.length === 0 ? (
          <EmptySdwBCards message="멘토가 없습니다. 필터를 변경해보세요." />
        ) : (
          mentorList.map((mentor, index) => (
            <MentorCard
              observeRef={index === mentorList.length - 1 ? lastElementRef : undefined}
              key={mentor.id}
              mentor={mentor}
            />
          ))
        )}
      </div>

      {!isDesktop && <FloatingUpBtn />}
    </section>
  );
};

export const MentorFindDesktopPanel = () => <MentorFindSectionBase isDesktop />;

export const MentorFindMobileSection = () => <MentorFindSectionBase isDesktop={false} />;

export default MentorFindMobileSection;

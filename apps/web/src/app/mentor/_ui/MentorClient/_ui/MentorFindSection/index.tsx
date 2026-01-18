"use client";

import useInfinityScroll from "@/utils/useInfinityScroll";

import MentorCard from "@/components/mentor/MentorCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";
import FloatingUpBtn from "@/components/ui/FloatingUpBtn";

import usePrefetchMentorFindTab from "./_hooks/usePrefetchMentorFindTab";
import useSelectedTab from "./_hooks/useSelectedTab";

import { FilterTab } from "@/types/mentor";

import { useGetMentorList } from "@/apis/mentor";

const MentorFindSection = () => {
  const { listRef, selectedTab, handleSelectTab } = useSelectedTab();

  const {
    data: mentorList = [],
    fetchNextPage,
    hasNextPage,
  } = useGetMentorList({
    region: selectedTab !== FilterTab.ALL ? selectedTab : "",
  });
  const { lastElementRef } = useInfinityScroll({ fetchNextPage, hasNextPage });
  usePrefetchMentorFindTab();

  return (
    <div className="px-4">
      <h2 className="mb-3 text-gray-900 typo-bold-5">멘토 찾기</h2>

      {/* 필터 탭 */}
      <div className="mb-3 flex gap-2">
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

      {/* 멘토 리스트 */}
      <div ref={listRef} className="space-y-4">
        {mentorList.length === 0 ? (
          <EmptySdwBCards message="멘토가 없습니다. 필터를 변경해보세요." />
        ) : (
          mentorList.map((mentor) => (
            <MentorCard
              observeRef={mentorList.length === mentorList.indexOf(mentor) + 1 ? lastElementRef : undefined}
              key={mentor.id}
              mentor={mentor}
            />
          ))
        )}
      </div>

      <FloatingUpBtn />
    </div>
  );
};

export default MentorFindSection;

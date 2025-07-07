import { useState } from "react";

import EmptyMentoChatCards from "./EmptyMentoChatCards";
import MentorCard from "./MentorCard";

export interface Channel {
  type: string;
  url: string;
}

export enum FilterTab {
  ALL = "전체",
  EUROPE = "유럽권",
  AMERICAS = "미주권",
  ASIA = "아시아권",
}

const getMentorToCountry = (selectedFilter) => {
  // 이 함수는 실제로 멘토 데이터를 필터링하는 로직을 구현해야 합니다.
  // 현재는 더미 데이터를 반환합니다.
  return [
    {
      id: 1,
      profileImageUrl: undefined,
      nickname: "정솔거너",
      country: "독일",
      universityName: "푸르트바겐스마르크 경영실무대학교",
      studyStatus: "STUDYING_ABROAD",
      menteeCount: 7,
      hasBadge: true,
      introduction: "독일 교환학생 경험을 나누고 싶습니다.",
      channels: [],
      isApplied: false,
    },
    {
      id: 2,
      profileImageUrl: undefined,
      nickname: "윤솔거",
      country: "미국",
      universityName: "안양하세요 교환학생에 대해 무엇이든 물어보세요...",
      studyStatus: "STUDYING_ABROAD",
      menteeCount: 0,
      hasBadge: false,
      introduction: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요!",
      channels: [],
      isApplied: false,
    },
  ];
};

const MentoFindSection = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>(FilterTab.ALL);
  const filteredMentors = getMentorToCountry(selectedFilter);

  return (
    <div className="px-4">
      <h2 className="mb-3 text-lg font-bold leading-normal text-gray-900">멘토 찾기</h2>

      {/* 필터 탭 */}
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setSelectedFilter(FilterTab.ALL)}
          className={`flex items-center justify-center gap-[10px] rounded-2xl px-[14px] py-1 text-center text-xs font-semibold leading-[150%] ${
            selectedFilter === FilterTab.ALL ? "bg-primary-100 text-primary" : "bg-k-50 text-k-300"
          }`}
        >
          {FilterTab.ALL}
        </button>
        <button
          onClick={() => setSelectedFilter(FilterTab.EUROPE)}
          className={`flex items-center justify-center gap-[10px] rounded-2xl px-[14px] py-1 text-center text-xs font-semibold leading-[150%] ${
            selectedFilter === FilterTab.EUROPE ? "bg-primary-100 text-primary" : "bg-k-50 text-k-300"
          }`}
        >
          {FilterTab.EUROPE}
        </button>
        <button
          onClick={() => setSelectedFilter(FilterTab.AMERICAS)}
          className={`flex items-center justify-center gap-[10px] rounded-2xl px-[14px] py-1 text-center text-xs font-semibold leading-[150%] ${
            selectedFilter === FilterTab.AMERICAS ? "bg-primary-100 text-primary" : "bg-k-50 text-k-300"
          }`}
        >
          {FilterTab.AMERICAS}
        </button>
        <button
          onClick={() => setSelectedFilter(FilterTab.ASIA)}
          className={`flex items-center justify-center gap-[10px] rounded-2xl px-[14px] py-1 text-center text-xs font-semibold leading-[150%] ${
            selectedFilter === FilterTab.ASIA ? "bg-primary-100 text-primary" : "bg-k-50 text-k-300"
          }`}
        >
          {FilterTab.ASIA}
        </button>
      </div>

      {/* 멘토 리스트 */}
      <div className="space-y-4">
        {filteredMentors.length === 0 ? (
          <EmptyMentoChatCards message="멘토가 없습니다. 필터를 변경해보세요." />
        ) : (
          filteredMentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)
        )}
      </div>
    </div>
  );
};

export default MentoFindSection;

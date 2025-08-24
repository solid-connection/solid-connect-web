"use client";

import PathBasedNavigation from "@/components/layout/PathBasedNavigation";
import UniversityCard from "@/components/ui/UniverSityCard";

import useSortedUniversities from "./_hooks/useSortedUniversities";
import FavoriteDropDown from "./_ui/FavoriteDropDown";

import useGetMyInfo from "@/api/my/client/useGetMyInfo";

const CHAT_NAVIGATION_TITLES = {
  "/my/favorite": "관심학교",
};

// 필터 타입 Enum
export enum filterType {
  LATEST = "최신순",
  LOW_SCORE = "낮은 성적순",
  NUMBER_OF_RECRUIT = "모집인원 순",
  EDIT = "편집하기",
}

// 드롭다운에 표시될 아이템 목록
const dropdownItems = [filterType.LATEST, filterType.LOW_SCORE, filterType.NUMBER_OF_RECRUIT, filterType.EDIT];

const FavoriteContent = () => {
  const { data: myInfo } = useGetMyInfo();
  const { nickname } = myInfo || {}; // myInfo가 없을 경우를 대비
  const { handleSelect, sortedUniversities, wishUniversity } = useSortedUniversities();

  return (
    <>
      <PathBasedNavigation
        icon={<FavoriteDropDown items={dropdownItems} handleSelect={handleSelect} />}
        customTitles={CHAT_NAVIGATION_TITLES}
      />
      <div className="px-5 pt-6">
        <p className="font-pretendard text-xl font-semibold text-k-700">
          {nickname ? `${nickname} 님이` : "회원님이"}
          <br />
          관심있는 학교
        </p>
        <div className="mt-5">
          {wishUniversity.length === 0 ? (
            <p className="py-20 text-center text-sm text-k-400">관심 학교가 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-4 pb-10">
              {/* 정렬된 배열을 사용하여 UI를 렌더링합니다. */}
              {sortedUniversities.map((university) => (
                <UniversityCard key={university.id} university={university} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoriteContent;

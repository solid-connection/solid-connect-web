"use client";

import { useState } from "react";

import UniversityCard from "@/components/ui/UniverSityCard";

import useSelectUniversities from "./_hooks/useSelectUniversities";
import useSortedUniversities from "./_hooks/useSortedUniversities";
import FavoriteDropDown from "./_ui/FavoriteDropDown";

import { useGetMyInfo } from "@/apis/MyPage";

// 필터 타입 Enum
export enum filterType {
  LATEST = "최신순",
  LOW_SCORE = "낮은 성적순",
  NUMBER_OF_RECRUIT = "모집인원 순",
}

// 드롭다운에 표시될 아이템 목록
const dropdownItems = [filterType.LATEST, filterType.LOW_SCORE, filterType.NUMBER_OF_RECRUIT];

const FavoriteContent = () => {
  const { data: myInfo } = useGetMyInfo();
  const { nickname } = myInfo || {}; // myInfo가 없을 경우를 대비
  const { handleSelect, sortedUniversities, wishUniversity } = useSortedUniversities();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { editSelected, handleEditSelected, handleDeleteAll } = useSelectUniversities();

  return (
    <>
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <p className="font-pretendard text-k-700 typo-sb-4">
            {nickname ? `${nickname} 님이` : "회원님이"}
            <br />
            관심있는 학교
          </p>

          <div className="flex items-center gap-2">
            <div className="flex gap-3">
              {!isEditMode ? (
                <button
                  className="min-w-16 rounded-lg bg-primary px-4 py-2 text-white transition-all duration-200 typo-medium-2"
                  onClick={() => setIsEditMode(true)}
                >
                  편집
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="min-w-16 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-gray-700 transition-all duration-200 typo-medium-2 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      handleDeleteAll();
                    }}
                    className="min-w-16 rounded-lg border-2 border-primary bg-primary px-4 py-2 text-white transition-all duration-200 typo-medium-2"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
            <FavoriteDropDown items={dropdownItems} handleSelect={handleSelect} />
          </div>
        </div>

        <div className="mt-5">
          {wishUniversity.length === 0 ? (
            <p className="py-20 text-center text-k-400 typo-regular-2">관심 학교가 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-4 pb-10">
              {/* 정렬된 배열을 사용하여 UI를 렌더링합니다. */}
              {sortedUniversities.map((university) => (
                <div key={university.id} className="flex w-full items-center justify-between gap-2">
                  {isEditMode && (
                    <button
                      className={`h-6 w-6 rounded-full border-2 ${editSelected?.includes(university.id) ? "border-primary bg-primary" : "border-gray-300 bg-white"}`}
                      onClick={() => handleEditSelected(university.id)}
                    />
                  )}
                  <UniversityCard key={university.id} university={university} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoriteContent;

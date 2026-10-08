"use client";

import { useState } from "react";
import { useGetMyInfo } from "@/apis/MyPage";
import UniversityCard from "@/components/ui/UniverSityCard";
import type { ListUniversity } from "@/types/university";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import useSelectUniversities from "./_hooks/useSelectUniversities";
import useSortedUniversities from "./_hooks/useSortedUniversities";
import FavoriteDropDown from "./_ui/FavoriteDropDown";

export enum filterType {
  LATEST = "최신순",
  LOW_SCORE = "낮은 성적순",
  NUMBER_OF_RECRUIT = "모집인원 순",
}

const dropdownItems = [filterType.LATEST, filterType.LOW_SCORE, filterType.NUMBER_OF_RECRUIT];

const FavoriteContent = () => {
  const { data: myInfo } = useGetMyInfo();
  const { nickname } = myInfo || {};
  const { handleSelect, sortedUniversities, wishUniversity } = useSortedUniversities();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { editSelected, handleEditSelected, handleDeleteAll } = useSelectUniversities();
  const isDesktop = useIsDesktopViewport();

  const handleDeleteSelected = () => {
    handleDeleteAll(() => setIsEditMode(false));
  };

  const viewProps = {
    nickname,
    sortedUniversities,
    wishUniversity,
    isEditMode,
    editSelected,
    setIsEditMode,
    handleSelect,
    handleEditSelected,
    handleDeleteSelected,
  };

  if (isDesktop === null) {
    return <div aria-hidden className="min-h-screen bg-white md:bg-k-50" />;
  }

  return isDesktop ? <FavoriteDesktopView {...viewProps} /> : <FavoriteMobileView {...viewProps} />;
};

type FavoriteViewProps = {
  nickname?: string;
  sortedUniversities: ListUniversity[];
  wishUniversity: ListUniversity[];
  isEditMode: boolean;
  editSelected: number[];
  setIsEditMode: (value: boolean) => void;
  handleSelect: (value: string) => void;
  handleEditSelected: (id: number) => void;
  handleDeleteSelected: () => void;
};

const FavoriteMobileView = ({
  nickname,
  sortedUniversities,
  wishUniversity,
  isEditMode,
  editSelected,
  setIsEditMode,
  handleSelect,
  handleEditSelected,
  handleDeleteSelected,
}: FavoriteViewProps) => {
  return (
    <div className="px-5 pt-6">
      <div className="flex items-center justify-between">
        <p className="font-pretendard text-k-700 typo-sb-4">
          {nickname ? `${nickname} 님이` : "회원님이"}
          <br />
          관심있는 학교
        </p>

        <FavoriteToolbar
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          handleDeleteSelected={handleDeleteSelected}
          handleSelect={handleSelect}
        />
      </div>

      <div className="mt-5">
        {wishUniversity.length === 0 ? (
          <FavoriteEmptyState />
        ) : (
          <div className="flex flex-col gap-4 pb-10">
            {sortedUniversities.map((university) => (
              <FavoriteMobileItem
                key={university.id}
                university={university}
                isEditMode={isEditMode}
                isSelected={editSelected?.includes(university.id)}
                onSelect={() => handleEditSelected(university.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FavoriteDesktopView = ({
  nickname,
  sortedUniversities,
  wishUniversity,
  isEditMode,
  editSelected,
  setIsEditMode,
  handleSelect,
  handleEditSelected,
  handleDeleteSelected,
}: FavoriteViewProps) => {
  return (
    <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
      <header className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-primary typo-sb-9">My Solid</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">관심학교</h1>
          <p className="mt-2 text-k-500 typo-medium-2">
            {nickname ? `${nickname} 님이 저장한` : "저장한"} 파견학교를 비교하고 정리하세요.
          </p>
        </div>

        <FavoriteToolbar
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          handleDeleteSelected={handleDeleteSelected}
          handleSelect={handleSelect}
        />
      </header>

      <section className="rounded-lg border border-k-100 bg-white p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-k-900 typo-bold-4">저장한 학교</h2>
            <p className="mt-1 text-k-500 typo-medium-4">
              총 <span className="text-primary typo-sb-9">{wishUniversity.length}</span>개
            </p>
          </div>
          {isEditMode && (
            <span className="rounded-full bg-primary-100 px-3 py-1 text-primary typo-medium-4">
              {editSelected.length}개 선택
            </span>
          )}
        </div>

        {wishUniversity.length === 0 ? (
          <FavoriteEmptyState />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {sortedUniversities.map((university) => (
              <FavoriteDesktopItem
                key={university.id}
                university={university}
                isEditMode={isEditMode}
                isSelected={editSelected?.includes(university.id)}
                onSelect={() => handleEditSelected(university.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const FavoriteToolbar = ({
  isEditMode,
  setIsEditMode,
  handleDeleteSelected,
  handleSelect,
}: {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  handleDeleteSelected: () => void;
  handleSelect: (value: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-3">
        {!isEditMode ? (
          <button
            className="min-w-16 rounded-lg bg-primary px-4 py-2 text-white transition-all duration-200 typo-medium-2 hover:bg-primary-700"
            onClick={() => setIsEditMode(true)}
          >
            편집
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsEditMode(false)}
              className="min-w-16 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-gray-700 transition-all duration-200 typo-medium-2 hover:bg-k-50"
            >
              취소
            </button>
            <button
              onClick={handleDeleteSelected}
              className="min-w-16 rounded-lg border-2 border-primary bg-primary px-4 py-2 text-white transition-all duration-200 typo-medium-2 hover:bg-primary-700"
            >
              삭제
            </button>
          </>
        )}
      </div>
      <FavoriteDropDown items={dropdownItems} handleSelect={handleSelect} />
    </div>
  );
};

const FavoriteMobileItem = ({
  university,
  isEditMode,
  isSelected,
  onSelect,
}: {
  university: ListUniversity;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      {isEditMode && <SelectionButton isSelected={isSelected} onClick={onSelect} />}
      <UniversityCard university={university} />
    </div>
  );
};

const FavoriteDesktopItem = ({
  university,
  isEditMode,
  isSelected,
  onSelect,
}: {
  university: ListUniversity;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {isEditMode && <SelectionButton isSelected={isSelected} onClick={onSelect} />}
      <UniversityCard university={university} />
    </div>
  );
};

const SelectionButton = ({ isSelected, onClick }: { isSelected: boolean; onClick: () => void }) => (
  <button
    type="button"
    aria-pressed={isSelected}
    aria-label={isSelected ? "선택 해제" : "선택"}
    className={`h-6 w-6 shrink-0 rounded-full border-2 ${
      isSelected ? "border-primary bg-primary" : "border-gray-300 bg-white"
    }`}
    onClick={onClick}
  />
);

const FavoriteEmptyState = () => (
  <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-k-100 bg-white py-20 text-center">
    <p className="text-k-400 typo-regular-2">관심 학교가 없습니다.</p>
  </div>
);

export default FavoriteContent;

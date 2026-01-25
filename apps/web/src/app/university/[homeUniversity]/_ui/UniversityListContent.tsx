"use client";

import { useMemo, useState } from "react";

import FloatingUpBtn from "@/components/ui/FloatingUpBtn";
import UniversityCards from "@/components/university/UniversityCards";
import type { HomeUniversityInfo } from "@/constants/university";
import type { ListUniversity, RegionEnumExtend } from "@/types/university";

import RegionFilter from "./RegionFilter";
import SearchBar from "./SearchBar";

interface UniversityListContentProps {
  universities: ListUniversity[];
  homeUniversity: HomeUniversityInfo;
  homeUniversitySlug: string;
}

const UniversityListContent = ({ universities, homeUniversity, homeUniversitySlug }: UniversityListContentProps) => {
  const [searchText, setSearchText] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<RegionEnumExtend | "전체">("전체");

  // 검색어 및 지역 필터링
  const filteredUniversities = useMemo(() => {
    let result = universities;

    // 검색어 필터링
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      result = result.filter(
        (uni) =>
          uni.koreanName.toLowerCase().includes(searchLower) || uni.country.toLowerCase().includes(searchLower),
      );
    }

    // 지역 필터링
    if (selectedRegion !== "전체") {
      result = result.filter((uni) => uni.region === selectedRegion);
    }

    return result;
  }, [universities, searchText, selectedRegion]);

  return (
    <div className="px-5">
      <SearchBar value={searchText} onChange={setSearchText} homeUniversitySlug={homeUniversitySlug} />

      <RegionFilter selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />

      {/* 결과 카운트 */}
      <div className="mb-3 text-k-500 typo-medium-4">
        총 <span className="text-primary typo-bold-4">{filteredUniversities.length}</span>개 학교
      </div>

      {/* 결과 표시 */}
      {filteredUniversities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-k-400 typo-medium-3">검색 결과가 없습니다.</p>
          <p className="mt-1 text-k-300 typo-medium-4">다른 검색어나 필터를 시도해보세요.</p>
        </div>
      ) : (
        <UniversityCards
          colleges={filteredUniversities}
          className="mt-3"
          linkPrefix={`/university/${homeUniversitySlug}`}
        />
      )}

      <FloatingUpBtn />
    </div>
  );
};

export default UniversityListContent;

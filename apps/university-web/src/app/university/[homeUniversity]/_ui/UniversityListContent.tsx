"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import FloatingUpBtn from "@/components/ui/FloatingUpBtn";
import UniversityCards from "@/components/university/UniversityCards";
import { COUNTRY_CODE_MAP } from "@/constants/university";
import {
  type CountryCode,
  type HomeUniversitySlug,
  LanguageTestType,
  type ListUniversity,
  RegionEnumExtend,
} from "@/types/university";

import RegionFilter from "./RegionFilter";
import SearchBar from "./SearchBar";

interface UniversityListContentProps {
  universities: ListUniversity[];
  homeUniversitySlug: HomeUniversitySlug;
}

const isCountryCode = (value: string): value is CountryCode => Object.hasOwn(COUNTRY_CODE_MAP, value);

const isRegionFilterValue = (value: string): value is RegionEnumExtend =>
  value === RegionEnumExtend.ALL ||
  value === RegionEnumExtend.AMERICAS ||
  value === RegionEnumExtend.EUROPE ||
  value === RegionEnumExtend.ASIA ||
  value === RegionEnumExtend.CHINA;

const isLanguageTestType = (value: string | null): value is LanguageTestType =>
  value !== null && Object.values(LanguageTestType).includes(value as LanguageTestType);

const UniversityListContentInner = ({ universities, homeUniversitySlug }: UniversityListContentProps) => {
  const searchParams = useSearchParams();
  const querySearchText = searchParams.get("searchText") ?? "";
  const languageTestTypeParam = searchParams.get("languageTestType");
  const queryLanguageTestType = isLanguageTestType(languageTestTypeParam) ? languageTestTypeParam : null;
  const queryCountryCodesKey = searchParams.getAll("countryCode").filter(isCountryCode).join(",");
  const queryRegion = searchParams.getAll("region").filter(isRegionFilterValue).at(0) ?? RegionEnumExtend.ALL;

  const [searchText, setSearchText] = useState(querySearchText.trim());
  const [selectedRegion, setSelectedRegion] = useState(queryRegion);

  useEffect(() => {
    setSearchText(querySearchText.trim());
  }, [querySearchText]);

  useEffect(() => {
    setSelectedRegion(queryRegion);
  }, [queryRegion]);

  // 검색어 및 지역 필터링
  const filteredUniversities = useMemo(() => {
    let result = universities;
    const queryCountryCodes = queryCountryCodesKey.split(",").filter(Boolean).filter(isCountryCode);

    // 검색어 필터링
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      result = result.filter(
        (uni) => uni.koreanName.toLowerCase().includes(searchLower) || uni.country.toLowerCase().includes(searchLower),
      );
    }

    // 지역 필터링
    if (selectedRegion !== "전체") {
      result = result.filter((uni) => uni.region === selectedRegion);
    }

    if (queryLanguageTestType) {
      result = result.filter((uni) =>
        uni.languageRequirements.some((requirement) => requirement.languageTestType === queryLanguageTestType),
      );
    }

    if (queryCountryCodes.length > 0) {
      const countryNames = queryCountryCodes.map((countryCode) => COUNTRY_CODE_MAP[countryCode]);
      result = result.filter((uni) => countryNames.includes(uni.country));
    }

    return result;
  }, [universities, searchText, selectedRegion, queryLanguageTestType, queryCountryCodesKey]);

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

const UniversityListContent = (props: UniversityListContentProps) => (
  <Suspense fallback={null}>
    <UniversityListContentInner {...props} />
  </Suspense>
);

export default UniversityListContent;

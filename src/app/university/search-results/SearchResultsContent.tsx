"use client";

import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

import UniversityCards from "@/components/university/UniversityCards";

import RegionFilter from "./RegionFilter";
import SearchBar from "./SearchBar";

import { CountryCode, LanguageTestType, RegionEnumExtend } from "@/types/university";

// 필요한 타입과 훅 import
import useGetUniversitySearchByFilter, {
  UniversitySearchFilterParams,
} from "@/api/university/client/useGetUniversitySearchByFilter";
import useGetUniversitySearchByText from "@/api/university/client/useGetUniversitySearchByText";

// --- URL 파라미터를 읽고 데이터를 처리하는 메인 컨텐츠 ---
const SearchResultsContent = () => {
  // 지역 상태 관리
  const [selectedRegion, setSelectedRegion] = useState<RegionEnumExtend>(RegionEnumExtend.ALL);
  // 지역 변경 핸들러
  const handleRegionChange = (region: RegionEnumExtend) => {
    setSelectedRegion(region);
  };

  const searchParams = useSearchParams();

  const { isTextSearch, searchText, filterParams } = useMemo(() => {
    const text = searchParams.get("searchText");
    const lang = searchParams.get("languageTestType");
    const countries = searchParams.getAll("countryCode");

    // URL에서 전달된 국가 목록을 기본으로 사용
    const filteredCountries = countries as CountryCode[];

    if (text) {
      return {
        isTextSearch: true,
        searchText: text,
        filterParams: {} as UniversitySearchFilterParams,
      };
    } else {
      return {
        isTextSearch: false,
        searchText: "",
        filterParams: {
          languageTestType: (lang as LanguageTestType) || undefined,
          countryCode: filteredCountries.length > 0 ? filteredCountries : undefined,
        },
      };
    }
  }, [searchParams, selectedRegion]);

  const textSearchQuery = useGetUniversitySearchByText(searchText);
  const filterSearchQuery = useGetUniversitySearchByFilter(filterParams);

  const { data: serachResult } = isTextSearch ? textSearchQuery : filterSearchQuery;

  // 지역 필터링된 데이터: university.region이 선택된 RegionEnumExtend와 정확히 일치하는 경우만 허용
  const filteredData = useMemo(() => {
    if (!serachResult) return serachResult;
    if (selectedRegion === RegionEnumExtend.ALL) return serachResult;

    return serachResult.filter((university) => university.region === selectedRegion);
  }, [serachResult, selectedRegion]);

  // 초기 URL에서 지역 파라미터 읽기
  React.useEffect(() => {
    const region = searchParams.get("region");
    if (region && Object.values(RegionEnumExtend).includes(region as RegionEnumExtend)) {
      setSelectedRegion(region as RegionEnumExtend);
    }
  }, [searchParams]);

  return (
    <div className="px-5">
      <SearchBar initText={searchText || undefined} />

      {/* 지역 필터 */}
      <RegionFilter selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />

      {/* 결과 표시 */}
      {!filteredData || filteredData.length === 0 ? (
        <div className="p-5 text-center text-gray-500">검색 결과가 없습니다.</div>
      ) : (
        <>
          <UniversityCards colleges={filteredData} className="mx-5 mt-3" />
        </>
      )}
    </div>
  );
};

export default SearchResultsContent;

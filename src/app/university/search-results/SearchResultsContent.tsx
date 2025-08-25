"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { z } from "zod";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import UniversityCards from "@/components/university/UniversityCards";

import SearchBar from "./SearchBar";

import { COUNTRY_CODE_MAP, REGION_KO_MAP, REGION_TO_COUNTRY_CODE_MAP } from "@/constants/university";
import { CountryCode, LanguageTestType, RegionEnumExtend } from "@/types/university";

// 필요한 타입과 훅 import
import useGetUniversitySearchByFilter, {
  UniversitySearchFilterParams,
} from "@/api/university/client/useGetUniversitySearchByFilter";
import useGetUniversitySearchByText from "@/api/university/client/useGetUniversitySearchByText";
import { zodResolver } from "@hookform/resolvers/zod";

// --- 임시 UI 컴포넌트들 ---
const LoadingComponent = () => <div className="p-5 text-center text-gray-500">대학 정보를 불러오는 중...</div>;
const ErrorComponent = ({ message }: { message: string }) => (
  <div className="p-5 text-center text-red-600">오류가 발생했습니다: {message}</div>
);
const NoResultsComponent = () => <div className="p-5 text-center text-gray-500">검색 결과가 없습니다.</div>;

// --- 지역 필터 컴포넌트 ---
const RegionFilter = ({
  selectedRegion,
  onRegionChange,
}: {
  selectedRegion: RegionEnumExtend;
  onRegionChange: (region: RegionEnumExtend) => void;
}) => {
  const regions = [
    RegionEnumExtend.ALL,
    RegionEnumExtend.EUROPE,
    RegionEnumExtend.AMERICAS,
    RegionEnumExtend.ASIA,
    RegionEnumExtend.CHINA,
  ];

  return (
    <div className="flex gap-2 overflow-x-auto p-4">
      {regions.map((region) => (
        <button
          key={region}
          onClick={() => onRegionChange(region)}
          className={`min-w-fit whitespace-nowrap rounded-full border px-4 py-2 transition-colors ${
            selectedRegion === region ? "border-primary bg-primary-100 text-primary-900" : "bg-k-50 text-k-300"
          } `}
        >
          {REGION_KO_MAP[region]}
        </button>
      ))}
    </div>
  );
};

// --- URL 파라미터를 읽고 데이터를 처리하는 메인 컨텐츠 ---
const SearchResultsContent = () => {
  const searchParams = useSearchParams();

  // 지역 상태 관리
  const [selectedRegion, setSelectedRegion] = useState<RegionEnumExtend>(RegionEnumExtend.ALL);

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

  const { data, isLoading, isError, error } = isTextSearch ? textSearchQuery : filterSearchQuery;

  // 지역 변경 핸들러
  const handleRegionChange = (region: RegionEnumExtend) => {
    setSelectedRegion(region);
  };

  // 지역 필터링된 데이터: university.region이 선택된 RegionEnumExtend와 정확히 일치하는 경우만 허용
  const filteredData = useMemo(() => {
    if (!data) return data;
    if (selectedRegion === RegionEnumExtend.ALL) return data;

    return data.filter((university) => university.region === selectedRegion);
  }, [data, selectedRegion]);

  // 초기 URL에서 지역 파라미터 읽기
  React.useEffect(() => {
    const region = searchParams.get("region");
    if (region && Object.values(RegionEnumExtend).includes(region as RegionEnumExtend)) {
      setSelectedRegion(region as RegionEnumExtend);
    }
  }, [searchParams]);

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent message={error.message} />;

  return (
    <div className="px-5">
      <SearchBar initText={searchText || undefined} />

      {/* 지역 필터 */}
      <RegionFilter selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />

      {/* 결과 표시 */}
      {!filteredData || filteredData.length === 0 ? (
        <NoResultsComponent />
      ) : (
        <>
          <UniversityCards colleges={filteredData} className="mx-5 mt-3" />
        </>
      )}
    </div>
  );
};

export default SearchResultsContent;

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import FloatingUpBtn from "@/components/ui/FloatingUpBtn";
import UniversityCards from "@/components/university/UniversityCards";
import { COUNTRY_CODE_MAP } from "@/constants/university";
import { IconSearch } from "@/public/svgs/search";
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
  title: string;
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

const REGION_FILTER_ITEMS = [
  { value: RegionEnumExtend.ALL, label: "전체" },
  { value: RegionEnumExtend.AMERICAS, label: "미주권" },
  { value: RegionEnumExtend.EUROPE, label: "유럽권" },
  { value: RegionEnumExtend.ASIA, label: "아시아권" },
  { value: RegionEnumExtend.CHINA, label: "중국권" },
] as const;

const UniversityListPrerenderFallback = ({ universities, homeUniversitySlug, title }: UniversityListContentProps) => (
  <div className="px-5 md:px-8 md:py-8 lg:px-10">
    <div className="mb-6 hidden md:block">
      <h1 className="text-k-900 typo-bold-1">{title}</h1>
    </div>

    <div className="md:grid md:grid-cols-[280px_minmax(0,1fr)] md:items-start md:gap-8">
      <aside className="md:sticky md:top-8">
        <div className="mb-4 mt-2 md:mt-0">
          <div className="flex items-center gap-2 rounded-lg border border-k-100 bg-k-50 px-4 py-3 text-k-400">
            <IconSearch className="h-5 w-5" />
            <span className="flex-1 typo-medium-4">학교명 또는 국가 검색</span>
          </div>

          <Link
            href={`/university/${homeUniversitySlug}/search`}
            className="mt-2 flex items-center justify-end gap-1 text-k-500 typo-medium-5 hover:text-primary"
          >
            <span>조건 검색</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.5 9L7.5 6L4.5 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
          {REGION_FILTER_ITEMS.map(({ value, label }) => (
            <span
              key={value}
              className={
                value === RegionEnumExtend.ALL
                  ? "whitespace-nowrap rounded-full border border-primary bg-primary-100 px-4 py-2 text-primary typo-medium-4"
                  : "whitespace-nowrap rounded-full border border-k-100 bg-k-50 px-4 py-2 text-k-500 typo-medium-4"
              }
            >
              {label}
            </span>
          ))}
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-3 text-k-500 typo-medium-4">
          총 <span className="text-primary typo-bold-4">{universities.length}</span>개 학교
        </div>

        {universities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-k-400 typo-medium-3">검색 결과가 없습니다.</p>
            <p className="mt-1 text-k-300 typo-medium-4">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        ) : (
          <UniversityCards colleges={universities} className="mt-3" linkPrefix={`/university/${homeUniversitySlug}`} />
        )}
      </section>
    </div>
  </div>
);

const UniversityListContentInner = ({ universities, homeUniversitySlug, title }: UniversityListContentProps) => {
  const searchParams = useSearchParams();
  const querySearchText = searchParams.get("searchText") ?? "";
  const languageTestTypeParam = searchParams.get("languageTestType");
  const queryLanguageTestType = isLanguageTestType(languageTestTypeParam) ? languageTestTypeParam : null;
  const queryCountryCodesKey = searchParams.getAll("countryCode").filter(isCountryCode).join(",");
  const queryRegionsKey = searchParams.getAll("region").filter(isRegionFilterValue).join(",");
  const queryRegions = useMemo(() => {
    const regions = queryRegionsKey.split(",").filter(isRegionFilterValue);
    return regions.length > 0 ? regions : [RegionEnumExtend.ALL];
  }, [queryRegionsKey]);

  const [searchText, setSearchText] = useState(querySearchText.trim());
  const [selectedRegions, setSelectedRegions] = useState<RegionEnumExtend[]>(queryRegions);

  useEffect(() => {
    setSearchText(querySearchText.trim());
  }, [querySearchText]);

  useEffect(() => {
    setSelectedRegions(queryRegions);
  }, [queryRegions]);

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
    if (!selectedRegions.includes(RegionEnumExtend.ALL)) {
      result = result.filter((uni) => selectedRegions.some((region) => uni.region === region));
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
  }, [universities, searchText, selectedRegions, queryLanguageTestType, queryCountryCodesKey]);

  return (
    <div className="px-5 md:px-8 md:py-8 lg:px-10">
      <div className="mb-6 hidden md:block">
        <h1 className="text-k-900 typo-bold-1">{title}</h1>
      </div>

      <div className="md:grid md:grid-cols-[280px_minmax(0,1fr)] md:items-start md:gap-8">
        <aside className="md:sticky md:top-8">
          <SearchBar value={searchText} onChange={setSearchText} homeUniversitySlug={homeUniversitySlug} />

          <RegionFilter selectedRegions={selectedRegions} onRegionChange={(region) => setSelectedRegions([region])} />
        </aside>

        <section className="min-w-0">
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
        </section>
      </div>

      <FloatingUpBtn />
    </div>
  );
};

const UniversityListContent = (props: UniversityListContentProps) => (
  <Suspense fallback={<UniversityListPrerenderFallback {...props} />}>
    <UniversityListContentInner {...props} />
  </Suspense>
);

export default UniversityListContent;

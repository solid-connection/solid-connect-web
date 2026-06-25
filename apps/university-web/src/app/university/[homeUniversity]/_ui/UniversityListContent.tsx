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
  <>
    <UniversityListMobileFallback universities={universities} homeUniversitySlug={homeUniversitySlug} />
    <UniversityListDesktopFallback universities={universities} homeUniversitySlug={homeUniversitySlug} title={title} />
  </>
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
    <>
      <UniversityListMobileView
        universities={filteredUniversities}
        homeUniversitySlug={homeUniversitySlug}
        searchText={searchText}
        selectedRegions={selectedRegions}
        setSearchText={setSearchText}
        setSelectedRegions={setSelectedRegions}
      />
      <UniversityListDesktopView
        universities={filteredUniversities}
        homeUniversitySlug={homeUniversitySlug}
        title={title}
        searchText={searchText}
        selectedRegions={selectedRegions}
        setSearchText={setSearchText}
        setSelectedRegions={setSelectedRegions}
      />
      <FloatingUpBtn />
    </>
  );
};

type UniversityListViewProps = {
  universities: ListUniversity[];
  homeUniversitySlug: HomeUniversitySlug;
  searchText: string;
  selectedRegions: RegionEnumExtend[];
  setSearchText: (value: string) => void;
  setSelectedRegions: (regions: RegionEnumExtend[]) => void;
};

const UniversityListMobileView = ({
  universities,
  homeUniversitySlug,
  searchText,
  selectedRegions,
  setSearchText,
  setSelectedRegions,
}: UniversityListViewProps) => {
  return (
    <div className="px-5 md:hidden">
      <SearchBar value={searchText} onChange={setSearchText} homeUniversitySlug={homeUniversitySlug} />
      <RegionFilter selectedRegions={selectedRegions} onRegionChange={(region) => setSelectedRegions([region])} />
      <ResultCount count={universities.length} />
      <UniversityResultList universities={universities} homeUniversitySlug={homeUniversitySlug} className="mt-3" />
    </div>
  );
};

const UniversityListDesktopView = ({
  universities,
  homeUniversitySlug,
  title,
  searchText,
  selectedRegions,
  setSearchText,
  setSelectedRegions,
}: UniversityListViewProps & { title: string }) => {
  return (
    <div className="hidden min-h-screen bg-k-50 px-8 py-8 md:block lg:px-10">
      <header className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-primary typo-sb-9">{title}</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">파견학교 목록</h1>
          <p className="mt-2 text-k-500 typo-medium-2">학교명, 국가, 권역 조건으로 지원 가능한 학교를 좁혀보세요.</p>
        </div>
        <Link
          href={`/university/${homeUniversitySlug}/search`}
          className="rounded-lg border border-k-100 bg-white px-4 py-3 text-k-700 transition-colors typo-sb-9 hover:border-primary hover:text-primary"
        >
          조건 검색
        </Link>
      </header>

      <div className="grid grid-cols-[300px_minmax(0,1fr)] items-start gap-8">
        <aside className="sticky top-8 space-y-5">
          <section className="rounded-lg border border-k-100 bg-white p-5">
            <h2 className="mb-4 text-k-900 typo-bold-4">검색</h2>
            <SearchBar value={searchText} onChange={setSearchText} homeUniversitySlug={homeUniversitySlug} />
          </section>

          <section className="rounded-lg border border-k-100 bg-white p-5">
            <h2 className="mb-4 text-k-900 typo-bold-4">권역</h2>
            <RegionFilter selectedRegions={selectedRegions} onRegionChange={(region) => setSelectedRegions([region])} />
          </section>
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <ResultCount count={universities.length} />
            <span className="text-k-400 typo-medium-5">최신 파견학기 기준</span>
          </div>
          <UniversityResultList universities={universities} homeUniversitySlug={homeUniversitySlug} className="mt-0" />
        </section>
      </div>
    </div>
  );
};

const UniversityListMobileFallback = ({
  universities,
  homeUniversitySlug,
}: Pick<UniversityListContentProps, "universities" | "homeUniversitySlug">) => (
  <div className="px-5 md:hidden">
    <SearchFallback homeUniversitySlug={homeUniversitySlug} />
    <RegionFilterFallback />
    <ResultCount count={universities.length} />
    <UniversityResultList universities={universities} homeUniversitySlug={homeUniversitySlug} className="mt-3" />
  </div>
);

const UniversityListDesktopFallback = ({ universities, homeUniversitySlug, title }: UniversityListContentProps) => (
  <div className="hidden min-h-screen bg-k-50 px-8 py-8 md:block lg:px-10">
    <header className="mb-8 flex items-end justify-between gap-6">
      <div>
        <p className="text-primary typo-sb-9">{title}</p>
        <h1 className="mt-2 text-k-900 typo-bold-1">파견학교 목록</h1>
        <p className="mt-2 text-k-500 typo-medium-2">학교명, 국가, 권역 조건으로 지원 가능한 학교를 좁혀보세요.</p>
      </div>
      <Link
        href={`/university/${homeUniversitySlug}/search`}
        className="rounded-lg border border-k-100 bg-white px-4 py-3 text-k-700 transition-colors typo-sb-9 hover:border-primary hover:text-primary"
      >
        조건 검색
      </Link>
    </header>

    <div className="grid grid-cols-[300px_minmax(0,1fr)] items-start gap-8">
      <aside className="sticky top-8 space-y-5">
        <section className="rounded-lg border border-k-100 bg-white p-5">
          <h2 className="mb-4 text-k-900 typo-bold-4">검색</h2>
          <SearchFallback homeUniversitySlug={homeUniversitySlug} />
        </section>
        <section className="rounded-lg border border-k-100 bg-white p-5">
          <h2 className="mb-4 text-k-900 typo-bold-4">권역</h2>
          <RegionFilterFallback desktop />
        </section>
      </aside>

      <section className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-4">
          <ResultCount count={universities.length} />
          <span className="text-k-400 typo-medium-5">최신 파견학기 기준</span>
        </div>
        <UniversityResultList universities={universities} homeUniversitySlug={homeUniversitySlug} className="mt-0" />
      </section>
    </div>
  </div>
);

const SearchFallback = ({ homeUniversitySlug }: { homeUniversitySlug: HomeUniversitySlug }) => (
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
);

const RegionFilterFallback = ({ desktop = false }: { desktop?: boolean }) => (
  <div className={desktop ? "mb-4 flex flex-col gap-2" : "mb-4 flex gap-2 overflow-x-auto pb-1"}>
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
);

const ResultCount = ({ count }: { count: number }) => (
  <div className="text-k-500 typo-medium-4">
    총 <span className="text-primary typo-bold-4">{count}</span>개 학교
  </div>
);

const UniversityResultList = ({
  universities,
  homeUniversitySlug,
  className,
}: {
  universities: ListUniversity[];
  homeUniversitySlug: HomeUniversitySlug;
  className?: string;
}) => {
  if (universities.length === 0) {
    return <EmptyUniversityResult />;
  }

  return (
    <UniversityCards colleges={universities} className={className} linkPrefix={`/university/${homeUniversitySlug}`} />
  );
};

const EmptyUniversityResult = () => (
  <div className="flex min-h-96 flex-col items-center justify-center rounded-lg border border-dashed border-k-100 bg-white py-20">
    <p className="text-k-400 typo-medium-3">검색 결과가 없습니다.</p>
    <p className="mt-1 text-k-300 typo-medium-4">다른 검색어나 필터를 시도해보세요.</p>
  </div>
);

const UniversityListContent = (props: UniversityListContentProps) => (
  <Suspense fallback={<UniversityListPrerenderFallback {...props} />}>
    <UniversityListContentInner {...props} />
  </Suspense>
);

export default UniversityListContent;

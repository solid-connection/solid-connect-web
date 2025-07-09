"use client";

import { useState } from "react";

import UniversityFilterSection from "@/components/search/UniversityFilterSection";
import UniversityRegionTabs from "@/components/search/UniversityRegionTabs";
import UniversitySearchInput from "@/components/search/UniversitySearchInput";

type Region = "EU" | "AM" | "AS";

const SearchContent = () => {
  // 1) 검색어
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 2) 선택된 권역
  const [region, setRegion] = useState<Region>("EU");

  // 3) 필터: 어학 / 국가
  const [language, setLanguage] = useState<string>("선택");
  const [country, setCountry] = useState<string>("선택");

  const handleSearch = () => {
    // TODO: API 호출 or 라우팅
    console.log({ searchQuery, region, language, country });
  };

  return (
    <div className="flex flex-col gap-4 px-5 pb-8">
      <UniversitySearchInput value={searchQuery} onChange={setSearchQuery} placeholder="해외 파견 학교를 검색하세요." />

      <UniversityRegionTabs
        regions={[
          { label: "유럽권", value: "EU" },
          { label: "미주권", value: "AM" },
          { label: "아시아권", value: "AS" },
        ]}
        selected={region}
        onSelect={setRegion}
      />

      <UniversityFilterSection
        // 어학 필터
        language={language}
        onLanguageChange={setLanguage}
        languageOptions={["선택", "TOEIC", "TOEFL", "IELTS"]}
        // 국가 필터
        country={country}
        onCountryChange={setCountry}
        countryOptions={["선택", "오스트레일리아", "체코", "캐나다"]}
      />

      <button
        onClick={handleSearch}
        disabled={!searchQuery}
        className="mt-4 w-full rounded bg-blue-600 py-3 text-white disabled:bg-gray-300"
      >
        학교 검색
      </button>
    </div>
  );
};

export default SearchContent;

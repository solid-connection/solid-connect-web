"use client";

import { useState } from "react";

import UniversityFilterSection from "@/components/search/UniversityFilterSection";
import UniversityRegionTabs from "@/components/search/UniversityRegionTabs";
import UniversitySearchInput from "@/components/search/UniversitySearchInput";

import { RegionKo } from "@/types/university";

const SearchContent = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [region, setRegion] = useState<RegionKo | null>(null);
  const [language, setLanguage] = useState<string>("선택");
  const [country, setCountry] = useState<string>("선택");

  const handleSearch = () => {
    console.log({ searchQuery, region, language, country });
  };

  return (
    <div className="flex flex-col gap-4 px-5 pb-8">
      <UniversitySearchInput value={searchQuery} onChange={setSearchQuery} placeholder="해외 파견 학교를 검색하세요." />

      <UniversityRegionTabs
        regions={[
          { label: "유럽권", value: "유럽권" },
          { label: "미주권", value: "미주권" },
          { label: "아시아권", value: "아시아권" },
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

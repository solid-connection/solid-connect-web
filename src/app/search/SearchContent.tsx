"use client";

import { useState } from "react";

import BlockBtn from "@/components/button/BlockBtn";
import UniversityFilterSection from "@/components/search/UniversityFilterSection";
import UniversityRegionTabs from "@/components/search/UniversityRegionTabs";
import UniversitySearchInput from "@/components/search/UniversitySearchInput";

import { LanguageTestEnum } from "@/types/score";
import { RegionKo } from "@/types/university";

const SearchContent = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [region, setRegion] = useState<RegionKo | null>(null);

  // 어학/국가 필터링
  const [language, setLanguage] = useState<string>("");
  const [countries, setCountries] = useState<string[]>(["", "", ""]);

  const addCountry = () => setCountries([...countries, "선택"]);
  const changeCountry = (idx: number, val: string) => setCountries(countries.map((c, i) => (i === idx ? val : c)));
  const removeCountry = (idx: number) => setCountries(countries.filter((_, i) => i !== idx));

  const handleSearch = () => {
    console.log({ searchQuery, region, language, countries });
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
        language={language}
        setLanguage={setLanguage}
        languageOptions={Object.values(LanguageTestEnum)}
        countries={countries}
        setCountries={setCountries}
        countryOptions={["오스트레일리아", "체코", "캐나다"]}
      />

      <BlockBtn onClick={handleSearch}>학교 검색</BlockBtn>
    </div>
  );
};

export default SearchContent;

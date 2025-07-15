"use client";

import { useRef, useState } from "react";

import BlockBtn from "@/components/button/BlockBtn";
import UniversityFilterSection from "@/components/search/UniversityFilterSection";
import UniversityRegionTabs from "@/components/search/UniversityRegionTabs";
import UniversitySearchInput from "@/components/search/UniversitySearchInput";

import { LanguageTestEnum } from "@/types/score";
import { RegionKo } from "@/types/university";

export interface RegionOption {
  label: string;
  value: RegionKo;
}

const regions: RegionOption[] = [
  { label: "유럽권", value: "유럽권" },
  { label: "미주권", value: "미주권" },
  { label: "아시아권", value: "아시아권" },
];

const SearchContent = () => {
  // 권역 필터링
  const searchQueryRef = useRef<HTMLInputElement>(null);
  const [region, setRegion] = useState<RegionKo | null>(null);

  const changeRegion = (value: string | null) => {
    if (value === null) {
      setRegion(null);
      return;
    }
    if (!["유럽권", "미주권", "아시아권"].includes(value)) {
      console.error("유효하지 않은 지역 선택");
    }
    setRegion(value as RegionKo);
  };

  // 어학/국가 필터링
  const [language, setLanguage] = useState<string>("");
  const [countries, setCountries] = useState<string[]>(["", "", ""]);

  const changeLanguage = (newLanguage: string) => {
    if (!Object.values(LanguageTestEnum).includes(newLanguage as LanguageTestEnum)) {
      console.error("유효하지 않은 어학 성적 선택");
    }
    setLanguage(newLanguage);
  };

  const changeCountry = (index: number, newCountry: string) => {
    setCountries((prevCountries) => {
      // TODO: 이후 나라 체크 로직 추가하기
      const updatedCountries = [...prevCountries];
      updatedCountries[index] = newCountry;
      return updatedCountries;
    });
  };

  const handleSearch = () => {
    const query = searchQueryRef.current?.value ?? "";
    console.log({ query, region, language, countries });
  };

  return (
    <div className="flex flex-col gap-4 px-5 pb-8">
      <UniversitySearchInput ref={searchQueryRef} placeholder="해외 파견 학교를 검색하세요." />

      <UniversityRegionTabs regions={regions} region={region} changeRegion={changeRegion} />

      <UniversityFilterSection
        language={language}
        changeLanguage={changeLanguage}
        languageOptions={Object.values(LanguageTestEnum)}
        countries={countries}
        changeCountry={changeCountry}
        countryOptions={["오스트레일리아", "체코", "캐나다"]}
      />

      <BlockBtn onClick={handleSearch}>학교 검색</BlockBtn>
    </div>
  );
};

export default SearchContent;

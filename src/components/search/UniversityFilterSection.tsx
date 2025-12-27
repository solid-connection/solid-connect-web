"use client";

import React, { Dispatch, SetStateAction } from "react";

import clsx from "clsx";

import UniversityRegionTabs from "@/components/search/UniversityRegionTabs";
import UniversitySearchInput from "@/components/search/UniversitySearchInput";

import { RegionKo } from "@/types/university";

import { RegionOption } from "@/app/search/SearchContent.tsx";
import { IconDownArrow, IconHatColor, IconHatGray, IconLocationColor, IconLocationGray } from "@/public/svgs/search";

interface UniversityFilterSectionProps {
  // optional: region tabs data
  regions?: RegionOption[];
  region?: RegionKo | null;
  changeRegion?: (value: string | null) => void;
  // 어학
  language: string;
  changeLanguage: (country: string) => void;
  languageOptions: string[];

  // 국가
  countries: string[];
  changeCountry: (index: number, country: string) => void;
  countryOptions: string[];
}

const UniversityFilterSection = ({
  regions,
  region,
  changeRegion,
  language,
  changeLanguage,
  languageOptions,

  countries,
  changeCountry,
  countryOptions,
}: UniversityFilterSectionProps) => {
  return (
    <div className="flex flex-col">
      {/* 검색 입력 */}
      <div className="mb-3">
        <UniversitySearchInput placeholder="해외 파견 학교를 검색하세요." />
      </div>

      {/* 지역 탭 (선택적으로 렌더링) */}
      {regions && changeRegion && (
        <div className="mb-3">
          <UniversityRegionTabs regions={regions} region={region ?? null} changeRegion={changeRegion} />
        </div>
      )}
      <div className="relative mb-1 flex flex-col gap-2">
        <div
          className={clsx(
            "relative flex justify-between rounded-lg border py-3 pl-3.5 pr-5",
            language ? "border-primary-100 bg-primary-100" : "border-k-100",
          )}
        >
          <div className="flex items-center gap-2.5">
            {language ? <IconHatColor /> : <IconHatGray />}
            <span className="typo-sb-9 text-k-700">어학</span>
          </div>
          <select
            className={clsx(
              "appearance-none bg-transparent pr-2.5 text-right typo-sb-9 focus:outline-none",
              language ? "text-primary" : "text-k-300",
            )}
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="">선택</option>
            {languageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <IconDownArrow className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-k-300" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {countries.map((cty, i) => {
          if (i === 0 || countries[i - 1]) {
            return (
              <div key={i} className="relative flex flex-col gap-2">
                <div
                  className={clsx(
                    "relative flex justify-between rounded-lg border py-3 pl-3.5 pr-5",
                    countries[i] ? "border-primary-100 bg-primary-100" : "border-k-100",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {countries[i] ? <IconLocationColor /> : <IconLocationGray />}
                    <span className="typo-sb-9 text-k-700">관심있는 나라</span>
                  </div>
                  <select
                    className={clsx(
                      "appearance-none bg-transparent pr-2.5 text-right typo-sb-9 focus:outline-none",
                      countries[i] ? "text-primary" : "text-k-300",
                    )}
                    value={countries[i]}
                    onChange={(e) => changeCountry(i, e.target.value)}
                  >
                    <option value="">나라</option>
                    {countryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <IconDownArrow className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-k-300" />
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default UniversityFilterSection;

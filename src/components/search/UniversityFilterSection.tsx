"use client";

import React, { Dispatch, SetStateAction } from "react";

import clsx from "clsx";

import { IconDownArrow, IconHatColor, IconHatGray, IconLocationColor, IconLocationGray } from "@/public/svgs/search";

interface UniversityFilterSectionProps {
  // 어학
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
  languageOptions: string[];

  // 국가
  countries: string[];
  setCountries: Dispatch<SetStateAction<string[]>>;
  countryOptions: string[];
}

const UniversityFilterSection = ({
  language,
  setLanguage,
  languageOptions,

  countries,
  setCountries,
  countryOptions,
}: UniversityFilterSectionProps) => {
  return (
    <div className="flex flex-col">
      <div className="relative mb-1 flex flex-col gap-2">
        <div
          className={clsx(
            "relative flex justify-between rounded-lg border py-3 pl-3.5 pr-5",
            language ? "border-primary-100 bg-primary-100" : "border-k-100",
          )}
        >
          <div className="flex items-center gap-2.5">
            {language ? <IconHatColor /> : <IconHatGray />}
            <span className="text-sm font-semibold leading-normal text-k-700">어학</span>
          </div>
          <select
            className={clsx(
              "appearance-none bg-transparent pr-2.5 text-right text-sm font-semibold focus:outline-none",
              language ? "text-primary" : "text-k-300",
            )}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
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

      {/* 국가 필터 그룹 */}
      <div className="flex flex-col gap-1">
        {countries.map((cty, i) => (
          <div key={i} className="relative flex flex-col gap-2">
            <div
              className={clsx(
                "relative flex justify-between rounded-lg border py-3 pl-3.5 pr-5",
                countries[i] ? "border-primary-100 bg-primary-100" : "border-k-100",
              )}
            >
              <div className="flex items-center gap-2.5">
                {countries[i] ? <IconLocationColor /> : <IconLocationGray />}
                <span className="text-sm font-semibold leading-normal text-k-700">관심있는 나라</span>
              </div>
              <select
                className={clsx(
                  "appearance-none bg-transparent pr-2.5 text-right text-sm font-semibold focus:outline-none",
                  countries[i] ? "text-primary" : "text-k-300",
                )}
                value={countries[i]}
                onChange={(e) => setCountries(countries.map((c, idx) => (idx === i ? e.target.value : c)))}
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
        ))}
      </div>
    </div>
  );
};

export default UniversityFilterSection;

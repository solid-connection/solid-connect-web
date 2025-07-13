"use client";

import React from "react";

import { GraduationCap, MapPin, Plus, X } from "lucide-react";

import { IconDownArrow, IconHatGray, IconLocationGray } from "@/public/svgs/search";

interface UniversityFilterSectionProps {
  // 어학
  languages: string[];
  onAddLanguage: () => void;
  onLanguageChange: (idx: number, value: string) => void;
  onRemoveLanguage: (idx: number) => void;
  languageOptions: string[];

  // 국가
  countries: string[];
  onAddCountry: () => void;
  onCountryChange: (idx: number, value: string) => void;
  onRemoveCountry: (idx: number) => void;
  countryOptions: string[];
}

const UniversityFilterSection = ({
  languages,
  onAddLanguage,
  onLanguageChange,
  onRemoveLanguage,
  languageOptions,

  countries,
  onAddCountry,
  onCountryChange,
  onRemoveCountry,
  countryOptions,
}: UniversityFilterSectionProps) => {
  return (
    <div className="flex flex-col gap-6 px-5">
      {/* 어학 필터 그룹 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between rounded-lg border border-k-100 py-3 pl-3.5 pr-5">
          <div className="flex items-center gap-2.5">
            <IconHatGray />
            <span className="text-sm font-semibold leading-normal text-k-700">어학</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold leading-normal text-k-300">선택</span>
            <IconDownArrow />
          </div>
        </div>
      </div>

      {/* 국가 필터 그룹 */}
      <div className="flex flex-col gap-2">
        {countries.map((cty, i) => (
          <div key={i} className="flex justify-between rounded-lg border border-k-100 py-3 pl-3.5 pr-5">
            <div className="flex items-center gap-2.5">
              <IconLocationGray />
              <span className="text-sm font-semibold leading-normal text-k-700">관심있는 나라</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold leading-normal text-k-300">나라</span>
              <IconDownArrow />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversityFilterSection;

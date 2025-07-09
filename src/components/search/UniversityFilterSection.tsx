"use client";

import React from "react";

import { GraduationCap, MapPin, Plus, X } from "lucide-react";

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
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5" />
          <span className="font-semibold">어학</span>
          <button onClick={onAddLanguage} className="ml-auto">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {languages.map((lang, i) => (
          <div key={i} className="relative flex items-center">
            <select
              value={lang}
              onChange={(e) => onLanguageChange(i, e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 pr-8"
            >
              <option value="">선택</option>
              {languageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <button onClick={() => onRemoveLanguage(i)} className="absolute right-2">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>

      {/* 국가 필터 그룹 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span className="font-semibold">관심있는 나라</span>
          <button onClick={onAddCountry} className="ml-auto">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {countries.map((cty, i) => (
          <div key={i} className="relative flex items-center">
            <select
              value={cty}
              onChange={(e) => onCountryChange(i, e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 pr-8"
            >
              <option value="">선택</option>
              {countryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <button onClick={() => onRemoveCountry(i)} className="absolute right-2">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversityFilterSection;

"use client";

import React from "react";

import { GraduationCap, MapPin } from "lucide-react";

interface UniversityFilterSectionProps {
  language: string;
  onLanguageChange: (v: string) => void;
  languageOptions: string[];

  country: string;
  onCountryChange: (v: string) => void;
  countryOptions: string[];
}

export default function UniversityFilterSection({
  language,
  onLanguageChange,
  languageOptions,
  country,
  onCountryChange,
  countryOptions,
}: UniversityFilterSectionProps) {
  return (
    <div className="flex flex-col gap-4 px-5">
      {/* 어학 필터 */}
      <div>
        <label className="mb-1 flex items-center space-x-2 text-gray-700">
          <GraduationCap className="h-5 w-5" />
          <span>어학</span>
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          {languageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* 나라 필터 */}
      <div>
        <label className="mb-1 flex items-center space-x-2 text-gray-700">
          <MapPin className="h-5 w-5" />
          <span>관심있는 나라</span>
        </label>
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          {countryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

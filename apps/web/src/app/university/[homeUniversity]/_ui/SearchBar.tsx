"use client";

import Link from "next/link";
import { useState } from "react";

import { IconSearch } from "@/public/svgs/search";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  homeUniversitySlug: string;
}

const SearchBar = ({ value, onChange, homeUniversitySlug }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4 mt-2">
      <div
        className={`flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors ${
          isFocused ? "border-primary bg-primary-50" : "border-k-100 bg-k-50"
        }`}
      >
        <IconSearch className={`h-5 w-5 ${isFocused ? "text-primary" : "text-k-400"}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="학교명 또는 국가 검색"
          className="flex-1 bg-transparent text-k-800 outline-none placeholder:text-k-400 typo-medium-4"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-k-300 text-white"
          >
            <span className="text-xs">✕</span>
          </button>
        )}
      </div>

      {/* 고급 검색 링크 */}
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
};

export default SearchBar;

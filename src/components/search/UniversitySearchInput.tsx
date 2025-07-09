"use client";

import React, { ChangeEvent } from "react";

import { IconSearch } from "@/public/svgs/search";

interface UniversitySearchInputProps {
  value: string;
  onChange: (q: string) => void;
  placeholder?: string;
}

const UniversitySearchInput = ({ value, onChange, placeholder = "" }: UniversitySearchInputProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-k-50 px-3.5 py-2.5 text-base font-normal leading-normal text-k-600 focus:outline-none"
      />
      <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center">
        <IconSearch />
      </div>
    </div>
  );
};

export default UniversitySearchInput;

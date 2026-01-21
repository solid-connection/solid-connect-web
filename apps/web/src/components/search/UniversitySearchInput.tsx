"use client";

import React, { forwardRef } from "react";

import { IconSearch } from "@/public/svgs/search";

interface UniversitySearchInputProps {
  placeholder?: string;
}

const UniversitySearchInput = forwardRef<HTMLInputElement, UniversitySearchInputProps>(({ placeholder = "" }, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg bg-k-50 px-3.5 py-2.5 text-k-600 typo-regular-1 focus:outline-none"
      />
      <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center">
        <IconSearch />
      </div>
    </div>
  );
});

UniversitySearchInput.displayName = "UniversitySearchInput";
export default UniversitySearchInput;

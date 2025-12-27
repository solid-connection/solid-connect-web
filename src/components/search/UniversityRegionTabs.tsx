"use client";

import React from "react";

import { RegionKo } from "@/types/university";

import { RegionOption } from "@/app/search/SearchContent.tsx";

interface UniversityRegionTabsProps {
  regions: RegionOption[];
  region: RegionKo | null;
  changeRegion: (value: string | null) => void;
}

const UniversityRegionTabs = ({ regions, region, changeRegion }: UniversityRegionTabsProps) => {
  return (
    <div className="flex gap-2.5">
      {regions.map((r) => (
        <button
          key={r.value}
          onClick={() => {
            if (region === r.value) {
              changeRegion(null);
              return;
            }

            changeRegion(r.value);
          }}
          className={`rounded-full px-3 py-[5px] transition typo-sb-12 ${
            region === r.value
              ? "border border-primary bg-primary-100 text-primary-900"
              : "border border-k-50 bg-k-50 text-k-300"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
};

export default UniversityRegionTabs;

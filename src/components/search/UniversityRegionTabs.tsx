"use client";

import React from "react";

import { RegionKo } from "@/types/university";

interface RegionOption {
  label: string;
  value: RegionKo;
}

interface UniversityRegionTabsProps {
  regions: RegionOption[];
  selected: string | null;
  onSelect: (value: RegionKo | null) => void;
}

const UniversityRegionTabs = ({ regions, selected, onSelect }: UniversityRegionTabsProps) => {
  return (
    <div className="flex gap-2.5">
      {regions.map((region) => (
        <button
          key={region.value}
          onClick={() => {
            if (selected === region.value) {
              onSelect(null);
              return;
            }

            onSelect(region.value);
          }}
          className={`rounded-full px-3 py-[5px] text-[11px] font-semibold leading-normal transition ${
            selected === region.value
              ? "border border-primary bg-primary-100 text-primary-900"
              : "border border-k-50 bg-k-50 text-k-300"
          }`}
        >
          {region.label}
        </button>
      ))}
    </div>
  );
};

export default UniversityRegionTabs;

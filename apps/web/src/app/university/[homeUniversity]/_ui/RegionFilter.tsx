"use client";

import clsx from "clsx";

import { RegionEnumExtend } from "@/types/university";

const REGIONS = [
  { value: "전체", label: "전체" },
  { value: RegionEnumExtend.AMERICAS, label: "미주권" },
  { value: RegionEnumExtend.EUROPE, label: "유럽권" },
  { value: RegionEnumExtend.ASIA, label: "아시아권" },
  { value: RegionEnumExtend.CHINA, label: "중국권" },
] as const;

interface RegionFilterProps {
  selectedRegion: RegionEnumExtend | "전체";
  onRegionChange: (region: RegionEnumExtend | "전체") => void;
}

const RegionFilter = ({ selectedRegion, onRegionChange }: RegionFilterProps) => {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {REGIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onRegionChange(value)}
          className={clsx(
            "whitespace-nowrap rounded-full border px-4 py-2 transition-colors typo-medium-4",
            selectedRegion === value
              ? "border-primary bg-primary-100 text-primary"
              : "border-k-100 bg-k-50 text-k-500 hover:border-k-200 hover:bg-k-100",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default RegionFilter;

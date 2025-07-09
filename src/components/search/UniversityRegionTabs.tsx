"use client";

import React from "react";

interface RegionOption {
  label: string;
  value: string;
}

interface UniversityRegionTabsProps {
  regions: RegionOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function UniversityRegionTabs({ regions, selected, onSelect }: UniversityRegionTabsProps) {
  return (
    <div className="flex space-x-2 px-5">
      {regions.map((region) => (
        <button
          key={region.value}
          onClick={() => onSelect(region.value)}
          className={`rounded-full px-4 py-2 transition ${
            selected === region.value ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {region.label}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

import SlimDropdown from "@/components/ui/SlimDropdown";

import { IconExpandMoreFilled } from "@/public/svgs/community";

type CommunityRegionSelectorProps = {
  curRegion: string;
  setCurRegion: React.Dispatch<React.SetStateAction<string>>;
  regionChoices: { code: string; nameKo: string }[];
};

const CommunityRegionSelector = ({ curRegion, setCurRegion, regionChoices }: CommunityRegionSelectorProps) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleSelectRegion = (regionCode: string) => {
    setCurRegion(regionCode);
    setIsDropdownVisible(false);
  };

  const dropdownOptions = regionChoices.map((region) => ({
    label: region.nameKo,
    action: () => handleSelectRegion(region.code),
  }));

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false); // 외부 클릭 시 드롭다운 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="pb-3.5 pl-5 pt-5">
      <div className="inline-block" ref={dropdownRef}>
        <button className="flex items-center gap-1" onClick={toggleDropdown} aria-label="게시판 변경">
          <div className="font-serif text-2xl font-semibold leading-normal">{curRegion}</div>
          <div>
            <IconExpandMoreFilled />
          </div>
        </button>
        <div className="relative">{isDropdownVisible && <SlimDropdown options={dropdownOptions} />}</div>
      </div>
    </div>
  );
};

export default CommunityRegionSelector;

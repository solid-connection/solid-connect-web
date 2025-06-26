"use client";

import ReactLinkify from "react-linkify";

import HeaderZone from "./HeaderZone";

interface MajorSectionProps {
  majorDetail: string;
}

const MajorSection = ({ majorDetail }: MajorSectionProps) => {
  return (
    <div>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <HeaderZone title="전공상세">
          <span className="break-words text-sm font-medium leading-normal text-k-600">
            <ReactLinkify>{majorDetail}</ReactLinkify>
          </span>
        </HeaderZone>
      </div>
    </div>
  );
};

export default MajorSection;

"use client";

import ReactLinkify from "react-linkify";

import HeaderZone from "./HeaderZone";

const MajorSection = ({ majorDetail }: { majorDetail: string }) => {
  return (
    <>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <HeaderZone title="전공상세">
          <span className="break-words text-sm font-medium leading-normal text-k-600">
            <ReactLinkify>{majorDetail}</ReactLinkify>
          </span>
        </HeaderZone>
      </div>
    </>
  );
};

export default MajorSection;

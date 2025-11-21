"use client";

import Linkify from "linkify-react";

interface MajorSectionProps {
  majorDetail: string;
}

const MajorSection = ({ majorDetail }: MajorSectionProps) => {
  return (
    <>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <div className="mb-3 text-base font-semibold text-k-900">전공상세</div>
        <div>
          <span className="break-words text-sm font-medium leading-normal text-k-600">
            <Linkify>{majorDetail}</Linkify>
          </span>
        </div>
      </div>
    </>
  );
};

export default MajorSection;

"use client";

import LinkifyText from "@/components/ui/LinkifyText";

interface MajorSectionProps {
  majorDetail: string;
}

const MajorSection = ({ majorDetail }: MajorSectionProps) => {
  return (
    <>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <div className="mb-3 text-base font-semibold text-k-900">전공상세</div>
        <div className="break-words text-sm font-medium leading-normal text-k-600">
          <LinkifyText>{majorDetail}</LinkifyText>
        </div>
      </div>
    </>
  );
};

export default MajorSection;

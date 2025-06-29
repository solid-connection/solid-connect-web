"use client";

import Linkify from "react-linkify";

interface EnglishSectionProps {
  englishDetail: string;
}

const EnglishSection = ({ englishDetail }: EnglishSectionProps) => {
  return (
    <>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <div className="mb-3 text-base font-semibold text-k-900">영어강의 리스트</div>
        <div>
          <span className="break-words text-sm font-medium leading-normal text-k-600">
            <Linkify>{englishDetail}</Linkify>
          </span>
        </div>
      </div>
    </>
  );
};

export default EnglishSection;

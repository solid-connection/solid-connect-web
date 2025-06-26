"use client";

import Linkify from "react-linkify";

import HeaderZone from "./HeaderZone";

interface EnglishSectionProps {
  englishDetail: string;
}

const EnglishSection = ({ englishDetail }: EnglishSectionProps) => {
  return (
    <div>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <HeaderZone title="영어강의 리스트">
          <span className="break-words text-sm font-medium leading-normal text-k-600">
            <Linkify>{englishDetail}</Linkify>
          </span>
        </HeaderZone>
      </div>
    </div>
  );
};

export default EnglishSection;

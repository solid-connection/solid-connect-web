"use client";

import Image from "next/image";
import ReactLinkify from "react-linkify";

import HeaderZone from "./HeaderZone";

const LanguageSection = () => {
  return (
    <>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <HeaderZone title="어학 성적">
          <div className="flex flex-col gap-5 pt-5">
            <Language name="TOEIC" logoUrl="/images/language/toeic.png" score="990" />
            <Language name="TOEFL IBT" logoUrl="/images/language/toefl_ibt.png" score="6.5" />
            <Language name="TOEFL ITP" logoUrl="/images/language/toefl_itp.png" score="990" />
            <Language name="IELTS" logoUrl="/images/language/ielts.png" score="6.5" />
          </div>
        </HeaderZone>
      </div>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <HeaderZone title="어학세부 요건">
          <span className="break-words text-sm font-medium leading-normal text-k-600">
            <ReactLinkify>https://internationalcenter.inha.ac.kr/internationalcenter/index.do</ReactLinkify>
          </span>
        </HeaderZone>
      </div>
    </>
  );
};

const Language = ({ name, logoUrl, score }: { name: string; logoUrl: string; score: string }) => {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="w-[140px] text-[13px] font-semibold leading-normal text-k-900">{name}</div>
        <div>
          <Image src={logoUrl} alt="어학시험" width={50} height={50} />
        </div>
      </div>
      <div className="text-base font-semibold text-secondary">{score}</div>
    </div>
  );
};

export default LanguageSection;

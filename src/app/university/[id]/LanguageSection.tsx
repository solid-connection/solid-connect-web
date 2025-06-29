"use client";

import Image from "next/image";
import Linkify from "react-linkify";

import { formatLanguageTestName, getLanguageTestLogo } from "@/utils/languageUtils";

import { LanguageRequirement } from "@/types/university";

interface LanguageSectionProps {
  languageRequirements: LanguageRequirement[];
  detailsForLanguage: string;
}

const LanguageSection = ({ languageRequirements, detailsForLanguage }: LanguageSectionProps) => {
  return (
    <>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <div className="mb-3 text-base font-semibold text-k-900">어학 성적</div>
        <div>
          <div className="flex flex-col gap-5 pt-5">
            {languageRequirements.map((req, idx) => (
              <Language
                key={`${req.languageTestType}-${idx}`}
                name={formatLanguageTestName(req.languageTestType)}
                logoUrl={getLanguageTestLogo(req.languageTestType)}
                score={req.minScore}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <div className="mb-3 text-base font-semibold text-k-900">어학세부 요건</div>
        <div>
          <span className="break-words text-sm font-medium leading-normal text-k-600">
            <Linkify>{detailsForLanguage}</Linkify>
          </span>
        </div>
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

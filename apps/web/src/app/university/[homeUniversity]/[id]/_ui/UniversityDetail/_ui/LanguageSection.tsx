"use client";

import Image from "@/components/ui/FallbackImage";
import LinkifyText from "@/components/ui/LinkifyText";
import type { LanguageRequirement } from "@/types/university";
import { formatLanguageTestName, getLanguageTestLogo } from "@/utils/languageUtils";

interface LanguageSectionProps {
  languageRequirements: LanguageRequirement[];
  detailsForLanguage: string;
}

const LanguageSection = ({ languageRequirements, detailsForLanguage }: LanguageSectionProps) => {
  return (
    <>
      <div className="h-1 bg-k-50" />
      <div className="my-7 px-3">
        <div className="mb-3 text-k-900 typo-sb-7">어학 성적</div>
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
        <div className="mb-3 text-k-900 typo-sb-7">어학세부 요건</div>
        <div>
          <span className="break-words text-k-600 typo-medium-2">
            <LinkifyText>{detailsForLanguage}</LinkifyText>
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
        <div className="w-[140px] text-k-900 typo-sb-10">{name}</div>
        <div>
          <Image src={logoUrl} alt="어학시험" width={50} height={50} fallbackSrc="/images/language/default.png" />
        </div>
      </div>
      <div className="text-secondary typo-sb-7">{score}</div>
    </div>
  );
};

export default LanguageSection;

"use client";

import { useState } from "react";

import BlockBtn from "@/components/button/BlockBtn";
import TextModal from "@/components/modal/TextModal";
import Tab from "@/components/ui/Tab";

import { LanguageTestScore, languageTestMapping } from "@/types/score";

import ScoreCard from "@/app/score/ScoreCard";

type LanguageStepProps = {
  languageTestScoreList: LanguageTestScore[];
  curLanguageTestScore: number | null;
  setCurLanguageTestScore: (id: number) => void;
  onNext: () => void;
};

const LanguageStep = ({
  languageTestScoreList,
  curLanguageTestScore,
  setCurLanguageTestScore,
  onNext,
}: LanguageStepProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="my-5 px-5">
        <Tab choices={["공인어학", "학점"]} choice="공인어학" setChoice={() => {}} />
        <div className="my-[14px] mb-40 flex flex-col gap-[14px]">
          {languageTestScoreList.map((score) => (
            <button
              className="transition-transform hover:scale-[1.01] active:scale-[0.97]"
              onClick={() => setCurLanguageTestScore(score.id)}
              key={score.id}
            >
              <ScoreCard
                key={score.id}
                name={languageTestMapping[score.languageTest.languageTestType]}
                score={score.languageTest.languageTestScore}
                status={score.verifyStatus}
                // date={new Date(score.issueDate).toISOString()}
                date="2025-01-01"
                isFocused={score.id === curLanguageTestScore}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-14 w-full max-w-[600px] bg-white">
        <div className="mb-[37px] px-5">
          <BlockBtn
            onClick={() => {
              if (!curLanguageTestScore) {
                setIsModalOpen(true);
                return;
              }
              onNext();
            }}
          >
            다음
          </BlockBtn>
        </div>
      </div>
      <TextModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        title=""
        content="지원할 성적을 선택해주십시오."
      />
    </>
  );
};

export default LanguageStep;

"use client";

import { useState } from "react";
import ScoreCard from "@/app/university/score/ScoreCard";
import TextModal from "@/components/modal/TextModal";
import Tab from "@/components/ui/Tab";
import { toast } from "@/lib/zustand/useToastStore";
import { type LanguageTestScore, languageTestScoreInfo, ScoreSubmitStatus } from "@/types/score";
import ApplicationBottomActionBar from "../_components/ApplicationBottomActionBar";
import ApplicationSectionTitle from "../_components/ApplicationSectionTitle";

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

  const handleNext = () => {
    if (curLanguageTestScore === null) {
      setIsModalOpen(true);
      return;
    }
    onNext();
  };

  return (
    <>
      <div className="my-5 px-5">
        <ApplicationSectionTitle title="어학 성적 선택" description="지원에 사용할 공인어학 성적을 선택해주세요." />
        <Tab choices={["공인어학", "학점"]} choice="공인어학" setChoice={() => {}} />
        <div className="my-[14px] mb-40 flex flex-col gap-3">
          {languageTestScoreList.map((score) => (
            <button
              className="transition-transform hover:scale-[1.01] active:scale-[0.97]"
              onClick={() => {
                if (score.verifyStatus === ScoreSubmitStatus.REJECTED) {
                  toast.error("승인 거절된 성적은 지원에 사용할 수 없습니다.");
                  return;
                }
                if (score.verifyStatus === ScoreSubmitStatus.PENDING) {
                  toast.error("승인 대기중인 성적은 지원에 사용할 수 없습니다.");
                  return;
                }
                setCurLanguageTestScore(score.id);
              }}
              key={score.id}
            >
              <ScoreCard
                key={score.id}
                name={score.languageTestResponse.languageTestType}
                score={`${score.languageTestResponse.languageTestScore}/${languageTestScoreInfo[score.languageTestResponse.languageTestType].max}`}
                status={score.verifyStatus}
                // date={new Date(score.issueDate).toISOString()}
                date="2025-01-01"
                isFocused={score.id === curLanguageTestScore}
              />
            </button>
          ))}
        </div>
      </div>
      <ApplicationBottomActionBar label="다음" onClick={handleNext} />
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

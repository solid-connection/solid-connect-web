"use client";

import { useState } from "react";
import ScoreCard from "@/app/university/score/ScoreCard";
import TextModal from "@/components/modal/TextModal";
import Tab from "@/components/ui/Tab";
import { toast } from "@/lib/zustand/useToastStore";
import { type GpaScore, ScoreSubmitStatus } from "@/types/score";
import ApplicationBottomActionBar from "../_components/ApplicationBottomActionBar";
import ApplicationSectionTitle from "../_components/ApplicationSectionTitle";

type GpaStepProps = {
  gpaScoreList: GpaScore[];
  curGpaScore: number | null;
  setCurGpaScore: (id: number) => void;
  onNext: () => void;
};

const GpaStep = ({ gpaScoreList, curGpaScore, setCurGpaScore, onNext }: GpaStepProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNext = () => {
    if (curGpaScore === null) {
      setIsModalOpen(true);
      return;
    }
    onNext();
  };

  return (
    <>
      <div className="my-5 px-5">
        <ApplicationSectionTitle title="학점 성적 선택" description="지원에 사용할 학점 성적을 선택해주세요." />
        <Tab choices={["공인어학", "학점"]} choice="학점" setChoice={() => {}} />
        <div className="my-[14px] mb-40 flex flex-col gap-3">
          {gpaScoreList.map((score) => (
            <button
              key={score.id}
              onClick={() => {
                if (score.verifyStatus === ScoreSubmitStatus.REJECTED) {
                  toast.error("승인 거절된 성적은 지원에 사용할 수 없습니다.");
                  return;
                }
                if (score.verifyStatus === ScoreSubmitStatus.PENDING) {
                  toast.error("승인 대기중인 성적은 지원에 사용할 수 없습니다.");
                  return;
                }
                setCurGpaScore(score.id);
              }}
              className="transition-transform hover:scale-[1.01] active:scale-[0.97]"
            >
              <ScoreCard
                name="인하대학교" // TODO: 학교명 API에서 받아오기
                score={`${score.gpaResponse.gpa.toFixed(2)}/${score.gpaResponse.gpaCriteria}`}
                status={score.verifyStatus}
                // date={new Date(score.issueDate).toISOString()}
                date="2025-01-01"
                isFocused={score.id === curGpaScore}
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

export default GpaStep;

"use client";

import { useState } from "react";

import BlockBtn from "@/components/button/BlockBtn";
import TextModal from "@/components/modal/TextModal";
import Tab from "@/components/ui/Tab";

import { GpaScore, ScoreSubmitStatus } from "@/types/score";

import ScoreCard from "@/app/university/score/ScoreCard";
import { toast } from "@/lib/zustand/useToastStore";

type GpaStepProps = {
  gpaScoreList: GpaScore[];
  curGpaScore: number | null;
  setCurGpaScore: (id: number) => void;
  onNext: () => void;
};

const GpaStep = ({ gpaScoreList, curGpaScore, setCurGpaScore, onNext }: GpaStepProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="my-5 px-5">
        <Tab choices={["공인어학", "학점"]} choice="학점" setChoice={() => {}} />
        <div className="my-[14px] mb-40 flex flex-col gap-[14px]">
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
      <div className="max-w-app fixed bottom-14 w-full bg-transparent">
        <div className="mb-[37px] px-5">
          <BlockBtn
            onClick={() => {
              if (curGpaScore === null) {
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

export default GpaStep;

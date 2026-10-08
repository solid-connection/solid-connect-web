"use client";

import clsx from "clsx";
import { useState } from "react";
import { DesktopScoreCard, MobileScoreCard } from "@/app/university/score/ScoreCard";
import TextModal from "@/components/modal/TextModal";
import Tab from "@/components/ui/Tab";
import { showIconToast } from "@/lib/toast/showIconToast";
import { type GpaScore, ScoreSubmitStatus } from "@/types/score";
import {
  DesktopApplicationBottomActionBar,
  MobileApplicationBottomActionBar,
} from "../_components/ApplicationBottomActionBar";
import ApplicationSectionTitle from "../_components/ApplicationSectionTitle";

type GpaStepProps = {
  gpaScoreList: GpaScore[];
  homeUniversityName: string;
  curGpaScore: number | null;
  setCurGpaScore: (id: number) => void;
  onNext: () => void;
};

const GpaStepBase = ({
  gpaScoreList,
  homeUniversityName,
  curGpaScore,
  setCurGpaScore,
  onNext,
  isDesktop,
}: GpaStepProps & { isDesktop: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ScoreCard = isDesktop ? DesktopScoreCard : MobileScoreCard;
  const ActionBar = isDesktop ? DesktopApplicationBottomActionBar : MobileApplicationBottomActionBar;

  const handleNext = () => {
    if (curGpaScore === null) {
      setIsModalOpen(true);
      return;
    }
    onNext();
  };

  return (
    <>
      <div className={clsx({ "my-5 px-5": !isDesktop })}>
        <ApplicationSectionTitle title="학점 성적 선택" description="지원에 사용할 학점 성적을 선택해주세요." />
        <div className={clsx(isDesktop ? "mt-5 max-w-md" : "")}>
          <Tab choices={["공인어학", "학점"]} choice="학점" setChoice={() => {}} />
        </div>
        <div className={clsx("my-[14px] grid gap-3", isDesktop ? "mb-0 lg:grid-cols-2" : "mb-40 grid-cols-1")}>
          {gpaScoreList.map((score) => (
            <button
              key={score.id}
              onClick={() => {
                if (score.verifyStatus === ScoreSubmitStatus.REJECTED) {
                  showIconToast("cap", "승인거절된 성적은 사용할 수 없습니다");
                  return;
                }
                if (score.verifyStatus === ScoreSubmitStatus.PENDING) {
                  showIconToast("cap", "심사중인 성적은 사용할 수 없습니다");
                  return;
                }
                setCurGpaScore(score.id);
              }}
              className="transition-transform hover:scale-[1.01] active:scale-[0.97]"
            >
              <ScoreCard
                name={homeUniversityName}
                score={`${score.gpaResponse.gpa.toFixed(2)}/${score.gpaResponse.gpaCriteria}`}
                status={score.verifyStatus}
                // date={new Date(score.issueDate).toISOString()}
                date={score.issueDate}
                isFocused={score.id === curGpaScore}
              />
            </button>
          ))}
        </div>
      </div>
      <ActionBar label="다음" onClick={handleNext} />
      <TextModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        title=""
        content="지원할 성적을 선택해주십시오."
      />
    </>
  );
};

export const DesktopGpaStep = (props: GpaStepProps) => <GpaStepBase {...props} isDesktop />;

export const MobileGpaStep = (props: GpaStepProps) => <GpaStepBase {...props} isDesktop={false} />;

export default MobileGpaStep;

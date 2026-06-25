"use client";

import clsx from "clsx";
import { useState } from "react";
import { DesktopScoreCard, MobileScoreCard } from "@/app/university/score/ScoreCard";
import TextModal from "@/components/modal/TextModal";
import Tab from "@/components/ui/Tab";
import { showIconToast } from "@/lib/toast/showIconToast";
import { formatLanguageTestScoreWithMax, type LanguageTestScore, ScoreSubmitStatus } from "@/types/score";
import {
  DesktopApplicationBottomActionBar,
  MobileApplicationBottomActionBar,
} from "../_components/ApplicationBottomActionBar";
import ApplicationSectionTitle from "../_components/ApplicationSectionTitle";

type LanguageStepProps = {
  languageTestScoreList: LanguageTestScore[];
  curLanguageTestScore: number | null;
  setCurLanguageTestScore: (id: number) => void;
  onNext: () => void;
};

const LanguageStepBase = ({
  languageTestScoreList,
  curLanguageTestScore,
  setCurLanguageTestScore,
  onNext,
  isDesktop,
}: LanguageStepProps & { isDesktop: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ScoreCard = isDesktop ? DesktopScoreCard : MobileScoreCard;
  const ActionBar = isDesktop ? DesktopApplicationBottomActionBar : MobileApplicationBottomActionBar;

  const handleNext = () => {
    if (curLanguageTestScore === null) {
      setIsModalOpen(true);
      return;
    }
    onNext();
  };

  return (
    <>
      <div className={clsx({ "my-5 px-5": !isDesktop })}>
        <ApplicationSectionTitle title="어학 성적 선택" description="지원에 사용할 공인어학 성적을 선택해주세요." />
        <div className={clsx(isDesktop ? "mt-5 max-w-md" : "")}>
          <Tab choices={["공인어학", "학점"]} choice="공인어학" setChoice={() => {}} />
        </div>
        <div className={clsx("my-[14px] grid gap-3", isDesktop ? "mb-0 lg:grid-cols-2" : "mb-40 grid-cols-1")}>
          {languageTestScoreList.map((score) => (
            <button
              className="transition-transform hover:scale-[1.01] active:scale-[0.97]"
              onClick={() => {
                if (score.verifyStatus === ScoreSubmitStatus.REJECTED) {
                  showIconToast("cap", "승인거절된 성적은 사용할 수 없습니다");
                  return;
                }
                if (score.verifyStatus === ScoreSubmitStatus.PENDING) {
                  showIconToast("cap", "심사중인 성적은 사용할 수 없습니다");
                  return;
                }
                setCurLanguageTestScore(score.id);
              }}
              key={score.id}
            >
              <ScoreCard
                key={score.id}
                name={score.languageTestResponse.languageTestType}
                score={formatLanguageTestScoreWithMax(
                  score.languageTestResponse.languageTestType,
                  score.languageTestResponse.languageTestScore,
                )}
                status={score.verifyStatus}
                // date={new Date(score.issueDate).toISOString()}
                date={score.issueDate}
                isFocused={score.id === curLanguageTestScore}
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

export const DesktopLanguageStep = (props: LanguageStepProps) => <LanguageStepBase {...props} isDesktop />;

export const MobileLanguageStep = (props: LanguageStepProps) => <LanguageStepBase {...props} isDesktop={false} />;

export default MobileLanguageStep;

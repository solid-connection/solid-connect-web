import Tab from "@/components/ui/Tab";

import { LanguageTestScore } from "@/types/score";

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
  return (
    <div className="my-5">
      <Tab choices={["공인어학", "학점"]} choice="공인어학" setChoice={() => {}} />
      <div className="my-[14px] flex flex-col gap-[14px]">
        {languageTestScoreList.map((score) => (
          <button
            className="transition-transform hover:scale-[1.01] active:scale-[0.97]"
            onClick={() => setCurLanguageTestScore(score.id)}
            key={score.id}
          >
            <ScoreCard
              key={score.id}
              name={score.languageTest.languageTestType}
              score={score.languageTest.languageTestScore}
              status={score.verifyStatus}
              date={new Date(score.issueDate).toISOString()}
              isFocused={score.id === curLanguageTestScore}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageStep;

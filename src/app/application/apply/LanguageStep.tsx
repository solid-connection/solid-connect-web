import BlockBtn from "@/components/button/BlockBtn";
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
                name={score.languageTest.languageTestType}
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
                alert("공인어학을 선택해주세요. 심사가 완료된 공인어학만 선택 가능합니다.");
                return;
              }
              onNext();
            }}
          >
            다음
          </BlockBtn>
        </div>
      </div>
    </>
  );
};

export default LanguageStep;

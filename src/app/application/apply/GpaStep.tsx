import BlockBtn from "@/components/button/BlockBtn";
import Tab from "@/components/ui/Tab";

import { GpaScore } from "@/types/score";

import ScoreCard from "@/app/score/ScoreCard";

type GpaStepProps = {
  gpaScoreList: GpaScore[];
  curGpaScore: number | null;
  setCurGpaScore: (id: number) => void;
  onNext: () => void;
};

const GpaStep = ({ gpaScoreList, curGpaScore, setCurGpaScore, onNext }: GpaStepProps) => {
  return (
    <>
      <div className="my-5 px-5">
        <Tab choices={["공인어학", "학점"]} choice="학점" setChoice={() => {}} />
        <div className="my-[14px] mb-40 flex flex-col gap-[14px]">
          {gpaScoreList.map((score) => (
            <button
              key={score.id}
              onClick={() => setCurGpaScore(score.id)}
              className="transition-transform hover:scale-[1.01] active:scale-[0.97]"
            >
              <ScoreCard
                name="인하대학교" // TODO: 학교명 API에서 받아오기
                score={`${score.gpa.gpa.toFixed(2)}/${score.gpa.gpaCriteria}`}
                status={score.verifyStatus}
                // date={new Date(score.issueDate).toISOString()}
                date="2025-01-01"
                isFocused={score.id === curGpaScore}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-14 w-full max-w-[600px] bg-white">
        <div className="mb-[37px] px-5">
          <BlockBtn
            onClick={() => {
              if (!curGpaScore) {
                alert("학점을 선택해주세요. 심사가 완료된 학점만 선택 가능합니다.");
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

export default GpaStep;

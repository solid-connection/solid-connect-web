import BlockBtn from "@/components/button/BlockBtn";

import { GpaScore, LanguageTestScore } from "@/types/score";
import { ListUniversity } from "@/types/university";

type ConfirmStepProps = {
  languageTestScore: LanguageTestScore | undefined;
  gpaScore: GpaScore | undefined;
  universityList: ListUniversity[];
  onNext: () => void;
};
const ConfirmStep = ({ languageTestScore, gpaScore, universityList, onNext }: ConfirmStepProps) => {
  return (
    <div>
      <div>현재까지의 등록정보</div>

      <div>학점</div>
      <div>
        {gpaScore?.gpa.gpa}/{gpaScore?.gpa.gpaCriteria}
      </div>

      <div>공인어학</div>
      <div>
        {languageTestScore?.languageTest.languageTestType} {languageTestScore?.languageTest.languageTestScore}
      </div>

      <div>해외 파견 학교</div>
      <div>{universityList.map((university) => university.koreanName).join(", ")}</div>

      <div className="fixed bottom-14 w-full max-w-[600px] bg-white">
        <div className="mb-[37px] px-5">
          <BlockBtn
            onClick={() => {
              onNext();
            }}
          >
            제출하기
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStep;

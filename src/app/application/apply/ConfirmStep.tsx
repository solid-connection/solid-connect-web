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
    <>
      <div className="mt-[11px] h-[93px] border-b-[10px] border-k-50 px-5">
        <div className="font-serif text-[22px] font-bold leading-normal text-k-900">최종 제출 확인</div>
        <div className="font-serif text-[13px] font-medium leading-normal text-k-600">
          제출 완료 후 성적을 변경 하실 수 없습니다.
        </div>
      </div>
      <div className="px-5">
        <div className="flex flex-col gap-3 pt-[27px]">
          <div className="flex gap-5">
            <div className="w-12 pt-3 font-serif text-[13px] font-semibold leading-normal text-k-900">공인어학</div>
            <div className="flex flex-1 justify-between rounded-lg bg-k-50 px-5 py-3">
              <div className="font-serif text-[11px] font-semibold leading-normal text-k-700">
                {languageTestScore?.languageTest.languageTestType}
              </div>
              <div className="text-right">
                <div className="font-serif text-[15px] font-semibold leading-normal text-primary">
                  {languageTestScore?.languageTest.languageTestScore}
                </div>
                <div className="font-serif text-[10px] font-normal leading-normal text-k-300">
                  만료일 : 2024.5.6까지
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-12 pt-3 font-serif text-[13px] font-semibold leading-normal text-k-900">학점</div>
            <div className="flex flex-1 justify-between rounded-lg bg-k-50 px-5 py-3">
              <div className="font-serif text-[11px] font-semibold leading-normal text-k-700">인하대학교</div>
              <div className="text-right">
                <div className="font-serif text-[15px] font-semibold leading-normal text-primary">
                  {gpaScore?.gpa.gpa.toFixed(2)}/{gpaScore?.gpa.gpaCriteria}
                </div>
                <div className="font-serif text-[10px] font-normal leading-normal text-k-300">~4학년 1학기</div>
              </div>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-12 pt-3 font-serif text-[13px] font-semibold leading-normal text-k-900">파견학교</div>
            <div className="flex flex-1 flex-col gap-2.5 rounded-lg bg-k-50 px-5 py-3">
              {universityList.map((university) => (
                <div key={university.id} className="flex justify-between">
                  <div className="font-serif text-xs font-semibold leading-normal text-k-700">
                    {universityList.indexOf(university) + 1}지망
                  </div>
                  <div className="text-right font-serif text-[11px] font-semibold leading-normal text-primary">
                    [{university.region} - {university.country}]<br />
                    {university.koreanName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
};

export default ConfirmStep;

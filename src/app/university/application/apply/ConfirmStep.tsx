import clsx from "clsx";

import BlockBtn from "@/components/button/BlockBtn";

import { ListUniversity } from "@/types/university";

import { IconCheck } from "@/public/svgs/mentor";

type ConfirmStepProps = {
  universityList: ListUniversity[];
  onNext: () => void;
};

const ConfirmStep = ({ universityList, onNext }: ConfirmStepProps) => {
  return (
    <div className="font-sans flex flex-col items-center justify-between bg-white p-5">
      {/* 상단 컨텐츠 */}
      <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
        <IconCheck />
        <h1 className="mt-4 typo-bold-1 text-secondary">
          지원하기 <span className="text-k-800">완료</span>
        </h1>
        <p className="mt-2 typo-regular-2 text-k-500">
          지원은 총 3번만 수정 가능하며,
          <br />
          제출 완료 후 성적을 변경 하실 수 없습니다.
        </p>

        {/* 지원 학교 목록 카드 */}
        <div className="mt-8 w-full rounded-lg border border-secondary bg-white p-2 shadow-sdwC">
          <div className="space-y-2">
            {universityList.map((university, index) => (
              <div
                key={university.id}
                className={clsx(
                  "flex items-center justify-between px-4 py-5 typo-regular-2",
                  index < universityList.length - 1 && "border-b border-gray-100",
                )}
              >
                <span className="typo-medium-2 text-gray-600">{index + 1}지망</span>
                <span className="typo-sb-9 text-blue-600 hover:underline">{university.koreanName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-10 w-full">
        <BlockBtn onClick={onNext}>제출하기</BlockBtn>
      </div>
    </div>
  );
};

export default ConfirmStep;

import clsx from "clsx";

import { IconCheck } from "@/public/svgs/mentor";
import type { ListUniversity } from "@/types/university";
import ApplicationBottomActionBar from "../_components/ApplicationBottomActionBar";
import ApplicationSectionTitle from "../_components/ApplicationSectionTitle";

type ConfirmStepProps = {
  universityList: ListUniversity[];
  onNext: () => void;
};

const ConfirmStep = ({ universityList, onNext }: ConfirmStepProps) => {
  return (
    <div className="my-5 px-5 pb-40">
      <div className="flex items-center justify-center">
        <IconCheck />
      </div>
      <ApplicationSectionTitle
        className="mt-4 text-center"
        title="지원 내용을 확인해주세요"
        description="제출 후에는 성적을 변경할 수 없습니다. 선택한 학교를 한 번 더 확인해주세요."
      />

      <div className="mt-5 rounded-lg bg-white p-4 shadow-sdwB">
        <div className="space-y-2">
          {universityList.map((university, index) => (
            <div
              key={university.id}
              className={clsx(
                "flex items-center justify-between px-4 py-4 typo-regular-2",
                index < universityList.length - 1 && "border-b border-k-50",
              )}
            >
              <span className="text-k-500 typo-medium-2">{index + 1}지망</span>
              <span className="text-primary typo-sb-9">{university.koreanName}</span>
            </div>
          ))}
        </div>
      </div>
      <ApplicationBottomActionBar label="제출하기" onClick={onNext} />
    </div>
  );
};

export default ConfirmStep;

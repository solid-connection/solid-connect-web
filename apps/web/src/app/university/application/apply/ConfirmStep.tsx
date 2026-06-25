import clsx from "clsx";

import { IconCheck } from "@/public/svgs/mentor";
import type { ListUniversity } from "@/types/university";
import {
  DesktopApplicationBottomActionBar,
  MobileApplicationBottomActionBar,
} from "../_components/ApplicationBottomActionBar";

type ConfirmStepProps = {
  universityList: ListUniversity[];
  onNext: () => void;
};

type ConfirmUniversityCardProps = {
  universityList: ListUniversity[];
  isDesktop: boolean;
};

const ConfirmUniversityCard = ({ universityList, isDesktop }: ConfirmUniversityCardProps) => {
  if (universityList.length === 0) return null;

  return (
    <div
      className={clsx(
        "mt-10 rounded-lg border border-secondary bg-white px-5 py-6",
        isDesktop ? "shadow-none" : "shadow-[0_0_5px_rgba(0,0,0,0.25)]",
      )}
    >
      {universityList.map((university, index) => (
        <div
          key={university.id}
          className={clsx(
            "flex items-center justify-between gap-4 py-[14px]",
            index === 0 && "pt-0",
            index === universityList.length - 1 && "pb-0",
            index < universityList.length - 1 && "border-b border-k-200",
          )}
        >
          <span className="shrink-0 text-k-900 typo-sb-8">{index + 1}지망</span>
          <span className="min-w-0 text-right text-primary typo-bold-5">
            [{university.country}] {university.koreanName}
          </span>
        </div>
      ))}
    </div>
  );
};

const ConfirmStepBase = ({ universityList, onNext, isDesktop }: ConfirmStepProps & { isDesktop: boolean }) => {
  const ActionBar = isDesktop ? DesktopApplicationBottomActionBar : MobileApplicationBottomActionBar;

  return (
    <div className={clsx(isDesktop ? "pt-4" : "px-5 pb-40 pt-[76px]")}>
      <div className="flex items-center justify-center">
        <IconCheck />
      </div>

      <div className="mt-1 text-center">
        <h2 className="text-k-800 typo-bold-5">
          <span className="text-secondary">지원</span> 확인하기
        </h2>
        <p className="mt-1 whitespace-pre-line text-k-600 typo-medium-3">
          {"지원은 총 3번만 수정 가능하며,\n제출 완료 후 성적을 변경 하실 수 없습니다."}
        </p>
      </div>

      <ConfirmUniversityCard universityList={universityList} isDesktop={isDesktop} />
      <ActionBar label="제출하기" onClick={onNext} />
    </div>
  );
};

export const DesktopConfirmStep = (props: ConfirmStepProps) => <ConfirmStepBase {...props} isDesktop />;

export const MobileConfirmStep = (props: ConfirmStepProps) => <ConfirmStepBase {...props} isDesktop={false} />;

export default MobileConfirmStep;

"use client";

import { useFormContext } from "react-hook-form";

import clsx from "clsx";

import BlockBtn from "@/components/button/BlockBtn";

import { MentorApplicationFormData } from "../../_lib/schema";

import { IconPrepare1, IconPrepare2, IconPrepare3 } from "@/public/svgs/auth";

type StudyStatusScreenProps = {
  onNext: () => void;
};

const StudyStatusScreen = ({ onNext }: StudyStatusScreenProps) => {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<MentorApplicationFormData>();

  const studyStatus = watch("studyStatus");

  const handleNext = async () => {
    const isValid = await trigger("studyStatus");
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="pb-28">
      <div className="px-5">
        <div className="mt-5">
          <span className="text-2xl font-bold leading-snug text-k-900">
            현재 나의
            <span className="text-primary"> 준비 단계</span>를
            <br />
            선택해주세요.
          </span>
        </div>

        {errors.studyStatus && <p className="mt-2 text-sm text-red-500">{errors.studyStatus.message}</p>}

        <div className="mt-10">
          <div className="flex flex-col gap-5">
            {/* 지원 솔커 - 비활성화 */}
            <StatusChoiceButton
              status="PLANNING"
              description="교환학생을 준비 중이신가요?"
              name="지원 슬커"
              icon={<IconPrepare1 />}
              isSelected={studyStatus === "PLANNING"}
              onClick={() => {}} // 클릭 불가
              disabled
            />

            <StatusChoiceButton
              status="STUDYING"
              description="합격했거나 수학 중이신가요?"
              name="수학 중"
              icon={<IconPrepare2 />}
              isSelected={studyStatus === "STUDYING"}
              onClick={() => setValue("studyStatus", "STUDYING")}
            />

            <StatusChoiceButton
              status="COMPLETED"
              description="교환학생 후 귀국한 학생이신가요?"
              name="수학 완료"
              icon={<IconPrepare3 />}
              isSelected={studyStatus === "COMPLETED"}
              onClick={() => setValue("studyStatus", "COMPLETED")}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full bg-white pb-14">
        <div className="max-w-app mx-auto w-full px-5">
          <BlockBtn className="mb-[29px]" disabled={!studyStatus} onClick={handleNext}>
            다음
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

export default StudyStatusScreen;

type StatusChoiceButtonProps = {
  status: string;
  description: string;
  name: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
};

const StatusChoiceButton = ({ description, name, icon, isSelected, onClick, disabled }: StatusChoiceButtonProps) => {
  return (
    <button
      className={clsx("rounded-lg py-5 shadow-sdwB", {
        "border border-primary bg-primary-100": isSelected && !disabled,
        "border border-white bg-white": !isSelected && !disabled,
      })}
      onClick={disabled ? undefined : onClick}
      type="button"
      disabled={disabled}
    >
      <div className={clsx("flex items-center gap-9", { "cursor-not-allowed opacity-30": disabled })}>
        <div className="pl-[2.75rem]">{icon}</div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-normal leading-normal text-k-500">{description}</span>
          <span className="text-xl font-semibold leading-normal text-k-800">{name}</span>
        </div>
      </div>
    </button>
  );
};

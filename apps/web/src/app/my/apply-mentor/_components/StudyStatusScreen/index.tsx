"use client";

import clsx from "clsx";
import { useFormContext } from "react-hook-form";

import BlockBtn from "@/components/button/BlockBtn";
import { IconPrepare1, IconPrepare2, IconPrepare3 } from "@/public/svgs/auth";
import type { MentorApplicationFormInputData } from "../../_lib/schema";

type StudyStatusScreenProps = {
  onNext: () => void;
};

const StudyStatusScreen = ({ onNext }: StudyStatusScreenProps) => {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<MentorApplicationFormInputData>();

  const preparationStatus = watch("preparationStatus");

  const handleNext = async () => {
    const isValid = await trigger("preparationStatus");
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="pb-28">
      <div className="px-5">
        <div className="mt-5">
          <span className="text-k-900 typo-bold-1">
            현재 나의
            <span className="text-primary"> 준비 단계</span>를
            <br />
            선택해주세요.
          </span>
        </div>

        {errors.preparationStatus && (
          <p className="mt-2 text-red-500 typo-regular-2">{errors.preparationStatus.message}</p>
        )}

        <div className="mt-10">
          <div className="flex flex-col gap-5">
            {/* 지원 솔커 - 비활성화 */}
            <StatusChoiceButton
              status="BEFORE_EXCHANGE"
              description="교환학생을 준비 중이신가요?"
              name="준비 중"
              icon={<IconPrepare1 />}
              isSelected={false}
              onClick={() => {}}
              disabled
            />

            <StatusChoiceButton
              status="DURING_EXCHANGE"
              description="합격했거나 수학 중이신가요?"
              name="수학 중"
              icon={<IconPrepare2 />}
              isSelected={false}
              onClick={() => {}}
              disabled
            />

            <StatusChoiceButton
              status="AFTER_EXCHANGE"
              description="교환학생 후 귀국한 학생이신가요?"
              name="수학 완료"
              icon={<IconPrepare3 />}
              isSelected={preparationStatus === "AFTER_EXCHANGE"}
              onClick={() => setValue("preparationStatus", "AFTER_EXCHANGE", { shouldValidate: true })}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full bg-white pb-14">
        <div className="mx-auto w-full max-w-app px-5">
          <BlockBtn className="mb-[29px]" disabled={!preparationStatus} onClick={handleNext}>
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
          <span className="text-k-500 typo-regular-5">{description}</span>
          <span className="text-k-800 typo-sb-4">{name}</span>
        </div>
      </div>
    </button>
  );
};

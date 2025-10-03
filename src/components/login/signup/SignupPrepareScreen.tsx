"use client";

import { toast } from "@/lib/zustand/useToastStore";

import { Dispatch, SetStateAction } from "react";

import clsx from "clsx";

import BlockBtn from "@/components/button/BlockBtn";

import { PreparationStatus, PreparationStatusEnum } from "@/types/auth";

import { IconPrepare1, IconPrepare2, IconPrepare3 } from "@/public/svgs/auth";

type SignupPrepareScreenProps = {
  preparation: PreparationStatus | null;
  setPreparation: Dispatch<SetStateAction<PreparationStatus | null>>;
  toNextStage: () => void;
};

const SignupPrepareScreen = ({ preparation, setPreparation, toNextStage }: SignupPrepareScreenProps) => {
  const submit = () => {
    if (!preparation) {
      toast.error("준비 단계를 선택해주세요.");
      return;
    }
    toNextStage();
  };

  return (
    <div className="mb-40">
      <div className="px-5">
        <div className="mt-5">
          <span className="text-2xl font-bold leading-snug text-k-900">
            현재 나의
            <span className="text-primary"> 준비 단계</span>를
            <br />
            선택해주세요.
          </span>
        </div>

        <div className="mt-10">
          <div className="flex flex-col gap-5">
            <PrepareChoiceButton
              status={PreparationStatusEnum.CONSIDERING}
              description="교환학생 지원을 고민 중인가요?"
              name="예비 솔커"
              icon={<IconPrepare1 />}
              preparation={preparation}
              setPreparation={setPreparation}
            />

            <PrepareChoiceButton
              status={PreparationStatusEnum.PREPARING_FOR_DEPARTURE}
              description="출국을 앞두고 있거나 교환학생인가요?"
              name="일반 솔커"
              icon={<IconPrepare2 />}
              preparation={preparation}
              setPreparation={setPreparation}
            />

            <PrepareChoiceButton
              status={PreparationStatusEnum.STUDYING_ABROAD}
              description="솔커 멘토로 활동하길 희망하나요?"
              name="멘토 솔커"
              icon={<IconPrepare3 />}
              preparation={preparation}
              setPreparation={setPreparation}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-14 w-full max-w-[600px] bg-white">
        <div className="px-5">
          <BlockBtn className="mb-[29px]" disabled={!preparation} onClick={submit}>
            다음
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

type PrepareChoiceButtonProps = {
  status: PreparationStatusEnum;
  description: string;
  name: string;
  icon: React.ReactNode;
  preparation: PreparationStatus | null;
  setPreparation: Dispatch<SetStateAction<PreparationStatus | null>>;
};

const PrepareChoiceButton = ({
  status,
  description,
  name,
  icon,
  preparation,
  setPreparation,
}: PrepareChoiceButtonProps) => {
  return (
    <button
      className={clsx("flex items-center gap-9 rounded-lg py-5 shadow-[0_0_6px_0_#DDDDDF]", {
        "border border-primary bg-primary-100": preparation === status,
        "border border-white bg-white": preparation !== status,
      })}
      onClick={() => setPreparation(status)}
      type="button"
    >
      <div className="pl-[2.75rem]">{icon}</div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-normal leading-normal text-k-500">{description}</span>
        <span className="text-xl font-semibold leading-normal text-k-800">{name}</span>
      </div>
    </button>
  );
};

export default SignupPrepareScreen;

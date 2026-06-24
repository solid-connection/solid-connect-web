"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { usePatchMyPassword } from "@/apis/MyPage";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import PasswordInput from "./_ui/PasswordInput";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "8자리 이상 입력해주세요."),
    newPassword: z
      .string()
      .min(8, "비밀번호는 대문자, 소문자, 숫자를 포함한 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "비밀번호는 대문자, 소문자, 숫자를 포함한 8자 이상이어야 합니다.",
      ),
    newPasswordConfirmation: z.string().min(1, "비밀번호를 다시 입력해주세요."),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "입력한 비밀번호가 일치하지 않습니다.",
    path: ["newPasswordConfirmation"],
  });

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

const PasswordContent = () => {
  const { mutate: patchMyPassword } = usePatchMyPassword();
  const [step, setStep] = useState(0); // 0: 현재 비밀번호, 1: 새 비밀번호
  const isDesktop = useIsDesktopViewport(false);

  const methods = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors, dirtyFields },
  } = methods;

  // 다음 단계로 이동
  const handleNextStep = async () => {
    const isCurrentPasswordValid = await trigger("currentPassword");
    if (isCurrentPasswordValid) {
      setStep(1);
    }
  };

  // 폼 최종 제출
  const onSubmit = (data: ChangePasswordFormData) => {
    patchMyPassword(data);
  };

  // watch 대신 dirtyFields와 errors를 사용해 버튼 활성화 상태 결정
  const isStep1ButtonEnabled = dirtyFields.currentPassword && !errors.currentPassword;
  const isStep2ButtonEnabled =
    dirtyFields.newPassword &&
    dirtyFields.newPasswordConfirmation &&
    !errors.newPassword &&
    !errors.newPasswordConfirmation;

  const formProps = {
    step,
    isStep1ButtonEnabled: Boolean(isStep1ButtonEnabled),
    isStep2ButtonEnabled: Boolean(isStep2ButtonEnabled),
    handleNextStep,
    onSubmit: handleSubmit(onSubmit),
  };

  return (
    <FormProvider {...methods}>
      {isDesktop ? <PasswordDesktopView {...formProps} /> : <PasswordMobileView {...formProps} />}
    </FormProvider>
  );
};

type PasswordViewProps = {
  step: number;
  isStep1ButtonEnabled: boolean;
  isStep2ButtonEnabled: boolean;
  handleNextStep: () => Promise<void>;
  onSubmit: () => void;
};

const PasswordMobileView = ({
  step,
  isStep1ButtonEnabled,
  isStep2ButtonEnabled,
  handleNextStep,
  onSubmit,
}: PasswordViewProps) => {
  return (
    <form className="px-5 py-7" onSubmit={onSubmit}>
      <p className="mb-8 typo-sb-4">비밀번호 변경</p>
      <PasswordFields step={step} />
      <div className="fixed bottom-0 left-0 right-0 mb-20 w-full py-4 md:left-[88px] md:right-auto md:w-[calc(100%-88px)]">
        <div className="mx-auto w-full max-w-app px-5 md:max-w-none">
          <PasswordActionButton
            step={step}
            isStep1ButtonEnabled={isStep1ButtonEnabled}
            isStep2ButtonEnabled={isStep2ButtonEnabled}
            handleNextStep={handleNextStep}
          />
        </div>
      </div>
    </form>
  );
};

const PasswordDesktopView = ({
  step,
  isStep1ButtonEnabled,
  isStep2ButtonEnabled,
  handleNextStep,
  onSubmit,
}: PasswordViewProps) => {
  return (
    <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
      <header className="mb-8">
        <p className="text-primary typo-sb-9">My Solid</p>
        <h1 className="mt-2 text-k-900 typo-bold-1">비밀번호 수정</h1>
        <p className="mt-2 text-k-500 typo-medium-2">현재 비밀번호 확인 후 새 비밀번호로 변경하세요.</p>
      </header>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(420px,640px)_minmax(280px,360px)]">
        <section className="rounded-lg border border-k-100 bg-white p-6">
          <form onSubmit={onSubmit}>
            <PasswordFields step={step} />
            <PasswordActionButton
              step={step}
              isStep1ButtonEnabled={isStep1ButtonEnabled}
              isStep2ButtonEnabled={isStep2ButtonEnabled}
              handleNextStep={handleNextStep}
            />
          </form>
        </section>

        <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
          <h2 className="text-k-900 typo-bold-4">보안 안내</h2>
          <div className="mt-5 space-y-4 text-k-600 typo-medium-3">
            <p>새 비밀번호는 대문자, 소문자, 숫자를 포함해 8자 이상으로 설정해야 합니다.</p>
            <p>다른 서비스에서 사용 중인 비밀번호와 동일하게 설정하지 않는 것을 권장합니다.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const PasswordFields = ({ step }: { step: number }) => (
  <>
    {step === 0 && (
      <PasswordInput
        name="currentPassword"
        label="현재 비밀번호를 입력해주세요"
        placeholder="8자리 이상 입력해주세요"
        approveMessage="올바른 비밀번호 형식입니다."
        autoFocus
      />
    )}

    {step === 1 && (
      <>
        <PasswordInput
          name="newPassword"
          label="새로운 비밀번호를 입력해주세요"
          placeholder="영문, 숫자, 특수문자 조합 8자 이상"
          approveMessage="사용 가능한 비밀번호입니다."
          autoFocus
        />
        <PasswordInput
          approveMessage="입력한 비밀번호와 동일합니다."
          name="newPasswordConfirmation"
          label="비밀번호를 다시 입력해주세요"
          placeholder="비밀번호 확인"
        />
      </>
    )}
  </>
);

const PasswordActionButton = ({
  step,
  isStep1ButtonEnabled,
  isStep2ButtonEnabled,
  handleNextStep,
}: {
  step: number;
  isStep1ButtonEnabled: boolean;
  isStep2ButtonEnabled: boolean;
  handleNextStep: () => Promise<void>;
}) => {
  if (step === 0) {
    return (
      <button
        type="button"
        onClick={handleNextStep}
        disabled={!isStep1ButtonEnabled}
        className={clsx(
          "w-full rounded-lg py-4 text-white transition-colors typo-sb-9",
          isStep1ButtonEnabled ? "bg-primary-600 hover:bg-primary-700" : "cursor-not-allowed bg-gray-400",
        )}
      >
        확인
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={!isStep2ButtonEnabled}
      className={clsx(
        "w-full rounded-lg py-4 text-white transition-colors typo-sb-9",
        isStep2ButtonEnabled ? "bg-primary-600 hover:bg-primary-700" : "cursor-not-allowed bg-gray-400",
      )}
    >
      변경하기
    </button>
  );
};

export default PasswordContent;

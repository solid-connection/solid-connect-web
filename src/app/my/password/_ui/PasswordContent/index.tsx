"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import clsx from "clsx";
import { z } from "zod";

import PasswordInput from "./_ui/PasswordInput";

import { zodResolver } from "@hookform/resolvers/zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(5, "5자리 이상 입력해주세요."),
    newPassword: z
      .string()
      .min(8, "비밀번호는 대문자, 소문자, 숫자를 포함한 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "비밀번호는 대문자, 소문자, 숫자를 포함한 8자 이상이어야 합니다.",
      ),
    confirmPassword: z.string().min(1, "비밀번호를 다시 입력해주세요."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "입력한 비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

const PasswordContent = () => {
  const [step, setStep] = useState(0); // 0: 현재 비밀번호, 1: 새 비밀번호

  const methods = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
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
  const onSubmit = (data) => {
    alert("현재 비밀번호 제공하기 기능이 제공되지 않습니다!");
  };

  // watch 대신 dirtyFields와 errors를 사용해 버튼 활성화 상태 결정
  const isStep1ButtonEnabled = dirtyFields.currentPassword && !errors.currentPassword;
  const isStep2ButtonEnabled =
    dirtyFields.newPassword && dirtyFields.confirmPassword && !errors.newPassword && !errors.confirmPassword;

  return (
    <FormProvider {...methods}>
      <form className="px-5 py-7" onSubmit={handleSubmit(onSubmit)}>
        <p className="mb-8 text-xl font-semibold">비밀번호 변경</p>

        {step === 0 && (
          <PasswordInput
            name="currentPassword"
            label="현재 비밀번호를 입력해주세요"
            placeholder="5자리 이상 입력해주세요"
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
              approveMessage={"입력한 비밀번호와 동일합니다."}
              name="confirmPassword"
              label="비밀번호를 다시 입력해주세요"
              placeholder="비밀번호 확인"
            />
          </>
        )}

        <div className="fixed bottom-0 left-0 mb-20 w-full px-5 py-4">
          {step === 0 && (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!isStep1ButtonEnabled}
              className={clsx(
                "w-full rounded-lg py-4 font-semibold text-white transition-colors",
                isStep1ButtonEnabled ? "bg-indigo-600 hover:bg-indigo-700" : "cursor-not-allowed bg-gray-400",
              )}
            >
              확인
            </button>
          )}

          {step === 1 && (
            <button
              type="submit"
              disabled={!isStep2ButtonEnabled}
              className={clsx(
                "w-full rounded-lg py-4 font-semibold text-white transition-colors",
                isStep2ButtonEnabled ? "bg-indigo-600 hover:bg-indigo-700" : "cursor-not-allowed bg-gray-400",
              )}
            >
              변경하기
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default PasswordContent;

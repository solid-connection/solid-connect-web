"use client";

import { useState } from "react";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ProgressBar from "@/components/ui/ProgressBar";

import EmailSignUpForm from "./EmailSignUpForm";

const EmailSignUpPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  return (
    <>
      <TopDetailNavigation title="이메일로 시작하기" />
      <div className="px-5 pt-2.5">
        <ProgressBar currentStep={currentStep} totalSteps={2} />
        <div className="mt-10">
          <span className="text-2xl font-bold leading-[1.4] text-k-900">
            이메일을
            <br />
            입력해주세요
          </span>
        </div>
        <div className="mt-10">
          <EmailSignUpForm />
        </div>
      </div>
    </>
  );
};

export default EmailSignUpPage;

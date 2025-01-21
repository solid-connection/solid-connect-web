"use client";

import { useEffect, useState } from "react";

import { getMyGpaScoreApi, getMyLanguageTestScoreApi } from "@/services/score";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ProgressBar from "@/components/ui/ProgressBar";

import LanguageStep from "./LanguageStep";

import { GpaScore, LanguageTestScore } from "@/types/score";

const ApplyPage = () => {
  const [step, setStep] = useState<number>(1);

  const [languageTestScoreList, setLanguageTestScoreList] = useState<LanguageTestScore[]>([]);
  const [gpaScoreList, setGpaScoreList] = useState<GpaScore[]>([]);

  const [curLanguageTestScore, setCurLanguageTestScore] = useState<number | null>(null);
  const [curGpaScore, setCurGpaScore] = useState<number | LanguageTestScore | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [gpaRes, languageRes] = await Promise.all([getMyGpaScoreApi(), getMyLanguageTestScoreApi()]);
        setGpaScoreList(gpaRes.data.gpaScoreStatusList);
        setLanguageTestScoreList(languageRes.data.languageTestScoreStatusList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  // 다음 스텝으로 넘어가기
  const goNextStep = () => setStep((prev) => prev + 1);
  // 이전 스텝으로 돌아가기
  const goPrevStep = () => setStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = async () => {
    // TODO:  최종 제출 로직 (서버에 한번에 전송)
    setStep(99);
  };

  return (
    <>
      <TopDetailNavigation title="지원하기" />
      <div className="px-5">
        <ProgressBar currentStep={step} totalSteps={3} />
        {step === 1 && (
          <LanguageStep
            languageTestScoreList={languageTestScoreList}
            curLanguageTestScore={curLanguageTestScore}
            setCurLanguageTestScore={setCurLanguageTestScore}
            onNext={goNextStep}
          />
        )}
        {/* {step === 2 && <GpaStep data={formData} setData={setFormData} onNext={goNextStep} onPrev={goPrevStep} />} */}
        {/* {step === 3 && <UniversityStep data={formData} setData={setFormData} onNext={goNextStep} onPrev={goPrevStep} />} */}
        {/* {step === 4 && <ConfirmStep data={formData} onSubmit={handleSubmit} onPrev={goPrevStep} />} */}
        {/* {step === 99 && <DoneScreen />} */}
      </div>
    </>
  );
};

export default ApplyPage;

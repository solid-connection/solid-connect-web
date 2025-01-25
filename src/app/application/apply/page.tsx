"use client";

import { useEffect, useState } from "react";

import { getMyGpaScoreApi, getMyLanguageTestScoreApi } from "@/services/score";
import { getUniversityListPublicApi } from "@/services/university";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ProgressBar from "@/components/ui/ProgressBar";

import ConfirmStep from "./ConfirmStep";
import DoneStep from "./DoneStep";
import GpaStep from "./GpaStep";
import LanguageStep from "./LanguageStep";
import UniversityStep from "./UniversityStep";

import { GpaScore, LanguageTestScore } from "@/types/score";
import { ListUniversity } from "@/types/university";

const ApplyPage = () => {
  const [step, setStep] = useState<number>(1);

  const [languageTestScoreList, setLanguageTestScoreList] = useState<LanguageTestScore[]>([]);
  const [gpaScoreList, setGpaScoreList] = useState<GpaScore[]>([]);
  const [universityList, setUniversityList] = useState<ListUniversity[]>([]);

  const [curLanguageTestScore, setCurLanguageTestScore] = useState<number | null>(null);
  const [curGpaScore, setCurGpaScore] = useState<number | null>(null);
  const [curUniversityList, setCurUniversityList] = useState<number[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [gpaRes, languageRes, universityRes] = await Promise.all([
          getMyGpaScoreApi(),
          getMyLanguageTestScoreApi(),
          getUniversityListPublicApi(),
        ]);
        setGpaScoreList(gpaRes.data.gpaScoreStatusList);
        setLanguageTestScoreList(languageRes.data.languageTestScoreStatusList);
        setUniversityList(universityRes.data);
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
      <TopDetailNavigation title="지원하기" handleBack={goPrevStep} />
      <div className="px-5">
        {(step === 1 || step === 2 || step === 3) && <ProgressBar currentStep={step} totalSteps={3} />}
      </div>
      {step === 1 && (
        <LanguageStep
          languageTestScoreList={languageTestScoreList}
          curLanguageTestScore={curLanguageTestScore}
          setCurLanguageTestScore={setCurLanguageTestScore}
          onNext={goNextStep}
        />
      )}
      {step === 2 && (
        <GpaStep
          gpaScoreList={gpaScoreList}
          curGpaScore={curGpaScore}
          setCurGpaScore={setCurGpaScore}
          onNext={goNextStep}
        />
      )}
      {step === 3 && (
        <UniversityStep
          universityList={universityList}
          curUniversityList={curUniversityList}
          setCurUniversityList={setCurUniversityList}
          onNext={goNextStep}
        />
      )}
      {step === 4 && (
        <ConfirmStep
          languageTestScore={languageTestScoreList.find((score) => score.id === curLanguageTestScore)}
          gpaScore={gpaScoreList.find((score) => score.id === curGpaScore)}
          universityList={universityList.filter((university) => curUniversityList.includes(university.id))}
          onNext={handleSubmit}
        />
      )}
      {step === 99 && <DoneStep />}
    </>
  );
};

export default ApplyPage;

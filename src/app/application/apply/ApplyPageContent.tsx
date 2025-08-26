"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ProgressBar from "@/components/ui/ProgressBar";

import ConfirmStep from "./ConfirmStep";
import DoneStep from "./DoneStep";
import EmptyGPA from "./EmptyGPA";
import GpaStep from "./GpaStep";
import LanguageStep from "./LanguageStep";
import UniversityStep from "./UniversityStep";

import { ListUniversity } from "@/types/university";

import usePostSubmitApplication from "@/api/applications/client/usePostSubmitApplication";
import useGetMyGpaScore from "@/api/score/client/useGetMyGpaScore";
import useGetMyLanguageTestScore from "@/api/score/client/useGetMyLanguageTestScore";
import useGetUniversitySearchByText from "@/api/university/client/useGetUniversitySearchByText";

const ApplyPageContent = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  const { data: universityList = [] } = useGetUniversitySearchByText("");
  const { data: gpaScoreList = [] } = useGetMyGpaScore();
  const { data: languageTestScoreList = [] } = useGetMyLanguageTestScore();
  const { mutate: postSubmitApplication } = usePostSubmitApplication();

  const [curLanguageTestScore, setCurLanguageTestScore] = useState<number | null>(null);
  const [curGpaScore, setCurGpaScore] = useState<number | null>(null);
  const [curUniversityList, setCurUniversityList] = useState<number[]>([]);

  // 다음 스텝으로 넘어가기
  const goNextStep = () => setStep((prev) => prev + 1);
  // 이전 스텝으로 돌아가기
  const goPrevStep = () => {
    if (step === 1) {
      router.back();
    }
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!curGpaScore) {
      alert("GPA를 선택해주세요.");
      return;
    }

    if (!curLanguageTestScore) {
      alert("어학성적을 선택해주세요.");
      return;
    }

    if (curUniversityList.length === 0 || curUniversityList[0] === 0) {
      alert("대학교를 선택해주세요.");
      return;
    }

    postSubmitApplication({
      gpaScoreId: curGpaScore,
      languageTestScoreId: curLanguageTestScore,
      universityChoiceRequest: {
        firstChoiceUniversityId: curUniversityList[0] || null,
        secondChoiceUniversityId: curUniversityList[1] || null,
        thirdChoiceUniversityId: curUniversityList[2] || null,
      },
    });
    setStep(99);
  };

  const isDataExist = gpaScoreList.length === 0 || languageTestScoreList.length === 0;
  return (
    <>
      <TopDetailNavigation title="지원하기" handleBack={goPrevStep} />
      <div className="mt-1 px-5">
        {(step === 1 || step === 2 || step === 3) && <ProgressBar currentStep={step} totalSteps={4} />}
      </div>
      {isDataExist ? (
        <EmptyGPA />
      ) : (
        <>
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
              universityList={
                curUniversityList
                  .map((id) => universityList.find((university) => university.id === id))
                  .filter(Boolean) as ListUniversity[]
              }
              onNext={handleSubmit}
            />
          )}
          {step === 99 && <DoneStep />}
        </>
      )}
    </>
  );
};

export default ApplyPageContent;

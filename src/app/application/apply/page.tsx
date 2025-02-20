"use client";

import { useEffect, useState } from "react";

import { postApplicationApi } from "@/services/application";
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
        setGpaScoreList(gpaRes.data.gpaScoreStatusList.filter((score: GpaScore) => score.verifyStatus === "APPROVED"));
        setLanguageTestScoreList(
          languageRes.data.languageTestScoreStatusList.filter(
            (score: LanguageTestScore) => score.verifyStatus === "APPROVED",
          ),
        );
        setUniversityList(universityRes.data);
      } catch (err) {
        if (err.response) {
          console.error("Axios response error", err.response);
          if (err.response.status === 401 || err.response.status === 403) {
            alert("로그인이 필요합니다");
            document.location.href = "/login";
          } else {
            alert(err.response.data?.message);
          }
        } else {
          console.error("Error", err.message);
          alert(err.message);
        }
      }
    };
    fetchAll();
  }, []);

  // 다음 스텝으로 넘어가기
  const goNextStep = () => setStep((prev) => prev + 1);
  // 이전 스텝으로 돌아가기
  const goPrevStep = () => setStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = async () => {
    if (!curGpaScore) {
      alert("GPA를 선택해주세요.");
      return;
    }

    if (!curLanguageTestScore) {
      alert("어학성적을 선택해주세요.");
      return;
    }

    if (curUniversityList.length === 0) {
      alert("대학교를 선택해주세요.");
      return;
    }

    try {
      await postApplicationApi({
        gpaScoreId: curGpaScore,
        languageTestScoreId: curLanguageTestScore,
        universityChoiceRequest: {
          firstChoiceUniversityId: curUniversityList[0] || null,
          secondChoiceUniversityId: curUniversityList[1] || null,
          thirdChoiceUniversityId: curUniversityList[2] || null,
        },
      });
      setStep(99);
    } catch (err) {
      alert(err.response.data.message);
    }
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
          onNext={() => {
            if (curUniversityList.length === 0) {
              alert("대학교를 선택해주세요.");
              return;
            }
            setCurUniversityList(curUniversityList.filter((id) => id !== null));

            goNextStep();
          }}
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

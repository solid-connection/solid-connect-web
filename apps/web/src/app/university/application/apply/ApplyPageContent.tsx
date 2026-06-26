"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { usePostSubmitApplication } from "@/apis/applications";
import { useGetMyGpaScore, useGetMyLanguageTestScore } from "@/apis/Scores";
import { useUniversitySearch } from "@/apis/universities";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ProgressBar from "@/components/ui/ProgressBar";
import { DEFAULT_MAX_CHOICE_COUNT, getHomeUniversityById } from "@/constants/university";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import type { ListUniversity } from "@/types/university";
import ConfirmStep from "./ConfirmStep";
import DoneStep from "./DoneStep";
import EmptyGPA from "./EmptyGPA";
import GpaStep from "./GpaStep";
import LanguageStep from "./LanguageStep";
import UniversityStep from "./UniversityStep";

const APPLY_PROGRESS_TOTAL_STEPS = 5;

const ApplyPageContent = () => {
  const router = useRouter();
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);
  const isAuthInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [step, setStep] = useState<number>(1);
  const maxChoiceCount = getHomeUniversityById(homeUniversityId)?.maxChoiceCount ?? DEFAULT_MAX_CHOICE_COUNT;
  const universitySearchOptions = useMemo(
    () => ({
      useDefaultTermId: true,
      homeUniversityId: homeUniversityId ?? undefined,
    }),
    [homeUniversityId],
  );

  const { data: universityList = [] } = useUniversitySearch("", undefined, universitySearchOptions);
  const { data: gpaScoreList = [] } = useGetMyGpaScore();
  const { data: languageTestScoreList = [] } = useGetMyLanguageTestScore();
  const { mutate: postSubmitApplication } = usePostSubmitApplication({
    onSuccess: () => {
      setStep(99);
    },
  });

  const [curLanguageTestScore, setCurLanguageTestScore] = useState<number | null>(null);
  const [curGpaScore, setCurGpaScore] = useState<number | null>(null);
  const [curUniversityList, setCurUniversityList] = useState<number[]>([]);

  useEffect(() => {
    if (!isAuthInitialized || !isAuthenticated || homeUniversityId !== null) {
      return;
    }

    router.replace("/my/school-email?returnTo=applicationApply");
  }, [homeUniversityId, isAuthInitialized, isAuthenticated, router]);

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
    if (curGpaScore === null) {
      showIconToast("logo", "GPA를 선택해주세요.");
      return;
    }

    if (curLanguageTestScore === null) {
      showIconToast("logo", "어학성적을 선택해주세요.");
      return;
    }

    const selectedUniversityIds = curUniversityList
      .filter((universityId) => Number.isInteger(universityId) && universityId > 0)
      .slice(0, maxChoiceCount);

    if (selectedUniversityIds.length === 0) {
      showIconToast("logo", "대학교를 선택해주세요.");
      return;
    }

    postSubmitApplication({
      gpaScoreId: curGpaScore,
      languageTestScoreId: curLanguageTestScore,
      universityChoiceRequest: {
        choices: selectedUniversityIds,
      },
    });
  };

  const isDataExist = gpaScoreList.length === 0 || languageTestScoreList.length === 0;
  const hasSelectedUniversity = curUniversityList.some((universityId) => universityId > 0);
  const progressStep = step === 3 && hasSelectedUniversity ? APPLY_PROGRESS_TOTAL_STEPS : step + 1;

  if (isAuthInitialized && isAuthenticated && homeUniversityId === null) {
    return null;
  }

  return (
    <>
      <TopDetailNavigation title="지원하기" handleBack={goPrevStep} />
      <div className="mt-1 px-5">
        {(step === 1 || step === 2 || step === 3) && (
          <ProgressBar currentStep={progressStep} totalSteps={APPLY_PROGRESS_TOTAL_STEPS} />
        )}
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
              maxChoiceCount={maxChoiceCount}
              onNext={goNextStep}
            />
          )}
          {step === 4 && (
            <ConfirmStep
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

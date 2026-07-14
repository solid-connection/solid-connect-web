"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { usePostSubmitApplication } from "@/apis/applications";
import { useGetMyGpaScore, useGetMyLanguageTestScore } from "@/apis/Scores";
import { useUniversitySearch } from "@/apis/universities";
import { getSchoolEmailVerificationPath } from "@/app/my/school-email/_lib/returnTo";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ProgressBar from "@/components/ui/ProgressBar";
import { DEFAULT_MAX_CHOICE_COUNT, getHomeUniversityById } from "@/constants/university";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import type { ListUniversity } from "@/types/university";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import { DesktopConfirmStep, MobileConfirmStep } from "./ConfirmStep";
import { DesktopDoneStep, MobileDoneStep } from "./DoneStep";
import { DesktopEmptyGPA, MobileEmptyGPA } from "./EmptyGPA";
import { DesktopGpaStep, MobileGpaStep } from "./GpaStep";
import { DesktopLanguageStep, MobileLanguageStep } from "./LanguageStep";
import { DesktopUniversityStep, MobileUniversityStep } from "./UniversityStep";

const APPLY_PROGRESS_TOTAL_STEPS = 5;
const APPLY_STEP_LABELS = ["어학 성적 선택", "학점 선택", "학교 선택", "제출 확인", "지원 완료"] as const;

const ApplyPageContent = () => {
  const router = useRouter();
  const isDesktop = useIsDesktopViewport();
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
  const shouldFetchGpaScore = isAuthInitialized && isAuthenticated && homeUniversityId !== null;
  // TODO: 서버의 모학교 미인증 에러 코드가 확정되면 GPA 조회 실패 시 학교 인증으로 보내는 fallback을 추가한다.
  const { data: gpaScoreData } = useGetMyGpaScore({ enabled: shouldFetchGpaScore });
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

    router.replace(getSchoolEmailVerificationPath("applicationApply"));
  }, [homeUniversityId, isAuthInitialized, isAuthenticated, router]);

  const goNextStep = () => setStep((prev) => prev + 1);
  const goPrevStep = () => {
    if (step === 1) {
      router.back();
      return;
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

  const gpaScoreList = gpaScoreData?.gpaScoreStatusResponseList ?? [];
  const homeUniversityName = gpaScoreData?.homeUniversityName;

  if (isDesktop === null) return null;

  const isScoreDataEmpty = !homeUniversityName || gpaScoreList.length === 0 || languageTestScoreList.length === 0;
  const hasSelectedUniversity = curUniversityList.some((universityId) => universityId > 0);
  const progressStep = step === 3 && hasSelectedUniversity ? APPLY_PROGRESS_TOTAL_STEPS : step + 1;
  const activeStepIndex =
    step === 99 ? APPLY_STEP_LABELS.length - 1 : Math.max(0, Math.min(step - 1, APPLY_STEP_LABELS.length - 1));

  const selectedUniversityList = curUniversityList
    .map((id) => universityList.find((university) => university.id === id))
    .filter(Boolean) as ListUniversity[];

  const renderDesktopStep = () => {
    if (isScoreDataEmpty) {
      return <DesktopEmptyGPA />;
    }

    return (
      <>
        {step === 1 && (
          <DesktopLanguageStep
            languageTestScoreList={languageTestScoreList}
            curLanguageTestScore={curLanguageTestScore}
            setCurLanguageTestScore={setCurLanguageTestScore}
            onNext={goNextStep}
          />
        )}
        {step === 2 && homeUniversityName && (
          <DesktopGpaStep
            gpaScoreList={gpaScoreList}
            homeUniversityName={homeUniversityName}
            curGpaScore={curGpaScore}
            setCurGpaScore={setCurGpaScore}
            onNext={goNextStep}
          />
        )}
        {step === 3 && (
          <DesktopUniversityStep
            universityList={universityList}
            curUniversityList={curUniversityList}
            setCurUniversityList={setCurUniversityList}
            maxChoiceCount={maxChoiceCount}
            onNext={goNextStep}
          />
        )}
        {step === 4 && <DesktopConfirmStep universityList={selectedUniversityList} onNext={handleSubmit} />}
        {step === 99 && <DesktopDoneStep />}
      </>
    );
  };

  const renderMobileStep = () => {
    if (isScoreDataEmpty) {
      return <MobileEmptyGPA />;
    }

    return (
      <>
        {step === 1 && (
          <MobileLanguageStep
            languageTestScoreList={languageTestScoreList}
            curLanguageTestScore={curLanguageTestScore}
            setCurLanguageTestScore={setCurLanguageTestScore}
            onNext={goNextStep}
          />
        )}
        {step === 2 && homeUniversityName && (
          <MobileGpaStep
            gpaScoreList={gpaScoreList}
            homeUniversityName={homeUniversityName}
            curGpaScore={curGpaScore}
            setCurGpaScore={setCurGpaScore}
            onNext={goNextStep}
          />
        )}
        {step === 3 && (
          <MobileUniversityStep
            universityList={universityList}
            curUniversityList={curUniversityList}
            setCurUniversityList={setCurUniversityList}
            maxChoiceCount={maxChoiceCount}
            onNext={goNextStep}
          />
        )}
        {step === 4 && <MobileConfirmStep universityList={selectedUniversityList} onNext={handleSubmit} />}
        {step === 99 && <MobileDoneStep />}
      </>
    );
  };

  if (isAuthInitialized && isAuthenticated && homeUniversityId === null) {
    return null;
  }

  if (isDesktop) {
    return (
      <div className="desktop-page-shell">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="text-primary typo-sb-9">Application</p>
              <h1 className="mt-2 text-k-900 typo-bold-1">지원하기</h1>
              <p className="mt-2 text-k-500 typo-medium-2">성적과 희망 학교를 선택해 모의 지원을 제출하세요.</p>
            </div>
            <button
              type="button"
              onClick={goPrevStep}
              className="rounded-lg border border-k-100 bg-white px-4 py-3 text-k-600 transition-colors hover:bg-k-50 typo-sb-9"
            >
              이전으로
            </button>
          </header>

          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
            <section className="min-h-[620px] rounded-lg border border-k-100 bg-white p-8">
              {(step === 1 || step === 2 || step === 3) && (
                <ProgressBar currentStep={progressStep} totalSteps={APPLY_PROGRESS_TOTAL_STEPS} />
              )}
              <div className="mt-8">{renderDesktopStep()}</div>
            </section>

            <aside className="desktop-sticky-panel rounded-lg border border-k-100 bg-white p-6">
              <h2 className="text-k-900 typo-bold-4">지원 단계</h2>
              <div className="mt-5 grid gap-3">
                {APPLY_STEP_LABELS.map((label, index) => {
                  const isActive = index === activeStepIndex;
                  const isDone = index < activeStepIndex;
                  return (
                    <div
                      key={label}
                      className={clsx(
                        "rounded-lg px-4 py-3 typo-medium-2",
                        isActive && "bg-primary-100 text-primary",
                        isDone && "bg-secondary-100 text-secondary",
                        !isActive && !isDone && "bg-k-50 text-k-500",
                      )}
                    >
                      {index + 1}. {label}
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 text-k-500 typo-medium-3">
                제출 후에는 지원자 현황에서 선택한 학교의 경쟁률을 확인할 수 있어요.
              </p>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopDetailNavigation title="지원하기" handleBack={goPrevStep} />
      <div className="mt-1 px-5">
        {(step === 1 || step === 2 || step === 3) && (
          <ProgressBar currentStep={progressStep} totalSteps={APPLY_PROGRESS_TOTAL_STEPS} />
        )}
      </div>
      {renderMobileStep()}
    </>
  );
};

export default ApplyPageContent;

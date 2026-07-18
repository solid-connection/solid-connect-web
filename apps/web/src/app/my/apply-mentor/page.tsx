"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";
import { usePostMentorApplication } from "@/apis/mentor";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { Progress } from "@/components/ui/Progress";
import { showIconToast } from "@/lib/toast/showIconToast";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import { DesktopCompletionScreen, MobileCompletionScreen } from "./_components/CompletionScreen";
import { DesktopInterestCountriesScreen, MobileInterestCountriesScreen } from "./_components/InterestCountriesScreen";
import { DesktopStudyStatusScreen, MobileStudyStatusScreen } from "./_components/StudyStatusScreen";
import { DesktopUniversityScreen, MobileUniversityScreen } from "./_components/UniversityScreen";
import { mentorApplicationSchema } from "./_lib/schema";

type FormInputValues = z.input<typeof mentorApplicationSchema>;
type FormOutputValues = z.output<typeof mentorApplicationSchema>;

const ApplyMentorPage = () => {
  const router = useRouter();
  const isDesktop = useIsDesktopViewport(false);
  const [step, setStep] = useState<number>(1);

  const methods = useForm<FormInputValues, unknown, FormOutputValues>({
    resolver: zodResolver(mentorApplicationSchema),
    defaultValues: {
      universityId: 0,
      term: "",
      verificationFile: undefined,
    },
    mode: "onChange",
  });

  const { mutate: postMentorApplication, isPending } = usePostMentorApplication();

  const goNextStep = () => setStep((prev) => prev + 1);
  const goPrevStep = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((prev) => Math.max(1, prev - 1));
  };

  const progress = ((step - 1) / 3) * 100;
  const stepTitle = step === 1 ? "회원 유형 선택" : step === 2 ? "수학 국가 선택" : step === 3 ? "수학 학교 선택" : "";

  const onSubmit = methods.handleSubmit((data: FormOutputValues) => {
    postMentorApplication(
      {
        preparationStatus: data.preparationStatus,
        universitySelectType: "CATALOG",
        country: data.country,
        universityId: data.universityId,
        term: data.term,
        verificationFile: data.verificationFile,
      },
      {
        onSuccess: () => {
          showIconToast("logo", "멘토 신청이 완료되었습니다.");
          goNextStep();
        },
      },
    );
  });

  if (step === 4) {
    return isDesktop ? <DesktopCompletionScreen /> : <MobileCompletionScreen />;
  }

  if (isDesktop) {
    return (
      <div className="desktop-page-shell">
        <FormProvider {...methods}>
          <header className="mb-8">
            <p className="text-primary typo-sb-9">My Solid</p>
            <h1 className="mt-2 text-k-900 typo-bold-1">멘토 전환 신청</h1>
            <p className="mt-2 text-k-500 typo-medium-2">수학 경험을 인증하고 멘토 프로필을 준비하세요.</p>
          </header>

          <div className="grid items-start gap-8 xl:grid-cols-[minmax(560px,760px)_minmax(280px,360px)]">
            <section className="rounded-lg border border-k-100 bg-white p-6">
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={goPrevStep}
                        className="rounded-lg border border-k-100 px-3 py-2 text-k-600 transition-colors hover:border-primary-300 hover:text-primary typo-sb-9"
                      >
                        이전
                      </button>
                    )}
                    <span className="text-k-900 typo-bold-4">{stepTitle}</span>
                  </div>
                  <span className="text-primary typo-sb-9">{step}/3</span>
                </div>
                <Progress showPercentage={false} value={progress} />
              </div>

              {step === 1 && <DesktopStudyStatusScreen onNext={goNextStep} />}
              {step === 2 && <DesktopInterestCountriesScreen onNext={goNextStep} />}
              {step === 3 && <DesktopUniversityScreen isSubmitting={isPending} onNext={onSubmit} />}
            </section>

            <aside className="desktop-sticky-panel rounded-lg border border-k-100 bg-white p-6">
              <h2 className="text-k-900 typo-bold-4">신청 단계</h2>
              <ol className="mt-5 space-y-4 text-k-600 typo-medium-3">
                <li className={step === 1 ? "text-primary" : ""}>1. 준비 단계 선택</li>
                <li className={step === 2 ? "text-primary" : ""}>2. 수학 국가 선택</li>
                <li className={step === 3 ? "text-primary" : ""}>3. 학교와 증빙서류 제출</li>
              </ol>
              <p className="mt-6 text-k-500 typo-regular-2">
                제출 후 관리자가 정보를 확인하면 멘토 회원으로 전환됩니다.
              </p>
            </aside>
          </div>
        </FormProvider>
      </div>
    );
  }

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        {/* Top Navigation */}
        <TopDetailNavigation title={stepTitle} handleBack={goPrevStep} />

        {/* Progress Bar */}
        <div className="px-5 pb-4 pt-4">
          <Progress showPercentage={false} value={progress} />
        </div>

        {/* Step Content */}
        {step === 1 && <MobileStudyStatusScreen onNext={goNextStep} />}
        {step === 2 && <MobileInterestCountriesScreen onNext={goNextStep} />}
        {step === 3 && <MobileUniversityScreen isSubmitting={isPending} onNext={onSubmit} />}
      </FormProvider>
    </div>
  );
};

export default ApplyMentorPage;

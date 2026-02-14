"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";
import { usePostMentorApplication } from "@/apis/mentor";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { Progress } from "@/components/ui/Progress";
import { toast } from "@/lib/zustand/useToastStore";
import CompletionScreen from "./_components/CompletionScreen";
import InterestCountriesScreen from "./_components/InterestCountriesScreen";
import StudyStatusScreen from "./_components/StudyStatusScreen";
import UniversityScreen from "./_components/UniversityScreen";
import { mentorApplicationSchema } from "./_lib/schema";

type FormInputValues = z.input<typeof mentorApplicationSchema>;
type FormOutputValues = z.output<typeof mentorApplicationSchema>;

const ApplyMentorPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  const methods = useForm<FormInputValues>({
    resolver: zodResolver(mentorApplicationSchema),
    defaultValues: {
      interestedCountries: [],
      country: "",
      universityName: "",
      verificationFile: undefined,
      studyStatus: undefined,
    },
    mode: "onChange",
  });

  const { mutate: postMentorApplication } = usePostMentorApplication();

  const goNextStep = () => setStep((prev) => prev + 1);
  const goPrevStep = () => {
    if (step === 1) {
      router.back();
    }
    setStep((prev) => Math.max(1, prev - 1));
  };

  const progress = ((step - 1) / 3) * 100;

  const onSubmit = methods.handleSubmit((data: FormOutputValues) => {
    postMentorApplication(
      {
        interestedCountries: data.interestedCountries,
        country: data.country,
        universityName: data.universityName,
        studyStatus: data.studyStatus,
        verificationFile: data.verificationFile,
      },
      {
        onSuccess: () => {
          toast.success("멘토 신청이 완료되었습니다.");
          goNextStep();
        },
      },
    );
  });

  if (step === 4) {
    return <CompletionScreen />;
  }

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        {/* Top Navigation */}
        <TopDetailNavigation
          title={step === 1 ? "회원 유형 선택" : step === 2 ? "관심 지역 선택" : step === 3 ? "수학 학교 선택" : ""}
          handleBack={goPrevStep}
        />

        {/* Progress Bar */}
        <div className="px-5 pb-4 pt-4">
          <Progress showPercentage={false} value={progress} />
        </div>

        {/* Step Content */}
        {step === 1 && <StudyStatusScreen onNext={goNextStep} />}
        {step === 2 && <InterestCountriesScreen onNext={goNextStep} />}
        {step === 3 && <UniversityScreen onNext={onSubmit} />}
      </FormProvider>
    </div>
  );
};

export default ApplyMentorPage;

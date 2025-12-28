"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { Progress } from "@/components/ui/Progress";

import CompletionScreen from "./_components/CompletionScreen";
import InterestCountriesScreen from "./_components/InterestCountriesScreen";
import StudyStatusScreen from "./_components/StudyStatusScreen";
import UniversityScreen from "./_components/UniversityScreen";
import { MentorApplicationFormData, mentorApplicationSchema } from "./_lib/schema";

import { usePostMentorApplication } from "@/apis/mentor";
import { toast } from "@/lib/zustand/useToastStore";
import { zodResolver } from "@hookform/resolvers/zod";

const ApplyMentorPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  const methods = useForm<MentorApplicationFormData>({
    resolver: zodResolver(mentorApplicationSchema),
    defaultValues: {
      interestedCountries: [],
      country: "",
      universityName: "",
      verificationFile: null,
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

  const onSubmit = methods.handleSubmit((data) => {
    if (!data.verificationFile) {
      toast.error("증명서 파일을 업로드해주세요.");
      return;
    }

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
          goNextStep(); // Go to completion screen
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

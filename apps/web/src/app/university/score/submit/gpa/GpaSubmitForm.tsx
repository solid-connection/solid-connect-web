"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { usePostGpaScore } from "@/apis/Scores";
import { getSchoolEmailVerificationPath } from "@/app/my/school-email/_lib/returnTo";
import { DesktopSubmitLinkTab, MobileSubmitLinkTab } from "@/components/score/SubmitLinkTab";
import { DesktopSubmitResult, type InfoRowProps, MobileSubmitResult } from "@/components/score/SubmitResult";
import CustomDropdown from "@/components/search/CustomDropdown";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import useAuthStore from "@/lib/zustand/useAuthStore";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import { type GpaFormData, gpaSchema } from "./_lib/schema";

const GpaSubmitForm = () => {
  const router = useRouter();
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);
  const isAuthInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showResult, setShowResult] = useState(false);
  const [submittedData, setSubmittedData] = useState<GpaFormData | null>(null);
  const { mutateAsync: postGpaScore } = usePostGpaScore();
  const isDesktop = useIsDesktopViewport();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<GpaFormData>({
    resolver: zodResolver(gpaSchema),
    mode: "onChange",
  });
  const selectedFile = watch("file");

  useEffect(() => {
    if (!isAuthInitialized || !isAuthenticated || homeUniversityId !== null) {
      return;
    }

    router.replace(getSchoolEmailVerificationPath("gpaSubmit"));
  }, [homeUniversityId, isAuthInitialized, isAuthenticated, router]);

  if (isAuthInitialized && isAuthenticated && homeUniversityId === null) {
    return null;
  }

  const onSubmit: SubmitHandler<GpaFormData> = async (data) => {
    await postGpaScore({
      gpaScoreRequest: {
        gpa: Number(data.gpa),
        gpaCriteria: Number(data.gpaCriteria),
        issueDate: "2025-01-01",
      },
      file: data.file[0],
    });
    setSubmittedData(data);
    setShowResult(true);
    reset();
  };

  if (isDesktop === null) return null;

  if (showResult && submittedData) {
    const Result = isDesktop ? DesktopSubmitResult : MobileSubmitResult;
    const infoRows: InfoRowProps[] = [
      {
        label: "학점 기준",
        status: `${submittedData.gpaCriteria} 만점`,
      },
      {
        label: "내 학점",
        status: submittedData.gpa,
      },
      {
        label: "성적 증명서",
        status: "제출 완료",
        statusColor: "text-blue-600",
        details: submittedData.file[0]?.name,
      },
    ];

    return (
      <Result
        title="학점 입력 완료"
        description="성적 승인은 최대 3일까지 걸릴 수 있습니다."
        buttonText="홈으로"
        onClick={() => router.push("/")}
        handleClose={() => setShowResult(false)}
        infoRows={infoRows}
      />
    );
  }

  const formTitle = (
    <div>
      <p className="font-serif text-k-900 typo-sb-3">대학교 성적 입력</p>
      <p className="font-serif text-k-600 typo-medium-3">
        공적 증명서만 인정됩니다.
        <br />
        미인정 서류를 업로드 할 경우 권한이 거부될 수 있습니다.
      </p>
    </div>
  );

  const formFields = (
    <div className="mt-[30px] flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label className="font-serif typo-sb-7">학점 기준</label>
        <Controller
          name="gpaCriteria"
          control={control}
          render={({ field }) => (
            <CustomDropdown
              placeholderSelect=""
              value={field.value}
              onChange={field.onChange}
              placeholder="학점 기준을 선택해주세요"
              options={[
                { value: "4.5", label: "4.5 만점" },
                { value: "4.3", label: "4.3 만점" },
              ]}
            />
          )}
        />
        {errors.gpaCriteria && <p className="mt-1 text-red-500 typo-regular-2">{errors.gpaCriteria.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-serif typo-sb-7">점수</label>
        <input
          type="number"
          step="0.01"
          className="flex h-10 items-center rounded-lg bg-k-50 px-5 py-2.5 font-serif text-secondary typo-sb-9"
          {...register("gpa")}
        />
        {errors.gpa && <p className="mt-1 text-red-500 typo-regular-2">{errors.gpa.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-serif typo-sb-7">증명서 첨부</label>
        <div className="flex items-center gap-3">
          <span className="flex h-10 flex-1 items-center truncate rounded-lg bg-k-50 px-5 py-2.5 font-serif text-secondary typo-sb-9">
            {selectedFile?.[0]?.name || "파일을 선택해주세요."}
          </span>
        </div>
        {errors.file && <p className="mt-1 text-red-500 typo-regular-2">{errors.file.message as string}</p>}

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <label className="cursor-pointer rounded-full bg-sub-c-100 px-4 py-2.5 font-serif text-sub-c-500 typo-sb-9">
            증명서 첨부
            <input id="file-upload" type="file" className="hidden" {...register("file")} />
          </label>
          <Link
            href="/university/score/example/gpa-cert"
            target="_blank"
            className="rounded-full bg-sub-e-100 px-4 py-2.5 text-sub-e-500 typo-sb-9"
          >
            증명서 예시 보기
          </Link>
        </div>
      </div>
    </div>
  );

  const submitButton = (
    <button
      className={clsx(
        "w-full rounded-lg py-4 text-white typo-sb-9",
        isValid ? "bg-primary" : "cursor-not-allowed bg-k-100",
      )}
      disabled={!isValid}
    >
      다음
    </button>
  );

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <p className="text-primary typo-sb-9">Score submit</p>
            <h1 className="mt-2 text-k-900 typo-bold-1">성적 입력하기</h1>
            <p className="mt-2 text-k-500 typo-medium-2">지원에 사용할 학점과 성적 증명서를 제출하세요.</p>
          </header>

          <div className="grid items-start gap-8 xl:grid-cols-[minmax(460px,600px)_minmax(300px,360px)]">
            <section className="rounded-lg border border-k-100 bg-white p-8">
              <DesktopSubmitLinkTab />
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                {formTitle}
                {formFields}
                <div className="mt-8">{submitButton}</div>
              </form>
            </section>

            <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
              <h2 className="text-k-900 typo-bold-4">제출 전 확인</h2>
              <div className="mt-5 grid gap-3 text-k-700 typo-medium-2">
                <div className="rounded-lg bg-k-50 px-4 py-3">직전학기와 학번이 보이는 증명서를 업로드해 주세요.</div>
                <div className="rounded-lg bg-k-50 px-4 py-3">승인 완료 전까지는 지원서에서 사용할 수 없습니다.</div>
                <div className="rounded-lg bg-k-50 px-4 py-3">점수와 기준 학점이 증명서와 일치해야 합니다.</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileSubmitLinkTab />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pt-[30px]">
          {formTitle}
          {formFields}
        </div>
        <div className="mt-10 w-full max-w-app md:max-w-none">
          <div className="mb-10">{submitButton}</div>
        </div>
      </form>
    </>
  );
};

const GpaSubmitPage = () => {
  return (
    <Suspense fallback={<CloudSpinnerPage />}>
      <GpaSubmitForm />
    </Suspense>
  );
};
export default GpaSubmitPage;

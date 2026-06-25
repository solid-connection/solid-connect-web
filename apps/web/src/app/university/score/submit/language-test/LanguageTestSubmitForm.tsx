"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { usePostLanguageTestScore } from "@/apis/Scores";
import SubmitLinkTab from "@/components/score/SubmitLinkTab";
import SubmitResult, { type InfoRowProps } from "@/components/score/SubmitResult";
import CustomDropdown from "@/components/search/CustomDropdown";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import { formatLanguageTestScoreWithMax, LanguageTestEnum, languageTestScoreInfo } from "@/types/score";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import { type LanguageTestFormData, languageTestSchema } from "./_lib/schema";

const LanguageTestSubmitForm = () => {
  const router = useRouter();
  const [showResult, setShowResult] = useState(false);
  const { mutateAsync: postLanguageTestScore } = usePostLanguageTestScore();
  const [submittedData, setSubmittedData] = useState<LanguageTestFormData | null>(null);
  const isDesktop = useIsDesktopViewport();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<LanguageTestFormData>({
    resolver: zodResolver(languageTestSchema),
    mode: "onChange",
  });

  const selectedFile = watch("file");

  const onSubmit: SubmitHandler<LanguageTestFormData> = async (data) => {
    try {
      await postLanguageTestScore({
        languageTestScoreRequest: {
          languageTestType: data.testType,
          languageTestScore: data.score,
          issueDate: "2025-01-01",
        },
        file: data.file[0],
      });

      reset();
      setShowResult(true);
      setSubmittedData(data);
    } catch (_error) {
      // 실패 토스트는 React Query 전역 onError에서 단일 처리
    }
  };

  if (isDesktop === null) return null;

  if (showResult && submittedData) {
    const submittedTestInfo = languageTestScoreInfo[submittedData.testType];

    const infoRows: InfoRowProps[] = [
      {
        label: "공인어학",
        status: submittedTestInfo.label,
        details: formatLanguageTestScoreWithMax(submittedData.testType, submittedData.score),
      },
      {
        label: "어학증명서",
        status: "제출 완료",
        details: submittedData.file[0]?.name,
      },
    ];

    return (
      <SubmitResult
        title="어학 성적 제출 완료"
        description="성적 승인은 최대 3일까지 걸릴 수 있습니다."
        buttonText="학점입력하기"
        variant={isDesktop ? "desktop" : "mobile"}
        onClick={() => router.push("/university/score/submit/gpa")}
        handleClose={() => setShowResult(false)}
        infoRows={infoRows}
      />
    );
  }

  const formTitle = (
    <div>
      <p className="font-serif text-k-900 typo-sb-3">어학 성적 입력</p>
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
        <label className="font-serif typo-sb-7">어학 종류</label>
        <Controller
          name="testType"
          control={control}
          render={({ field }) => (
            <CustomDropdown
              placeholderSelect=""
              value={field.value}
              onChange={field.onChange}
              placeholder="어학 종류를 선택해주세요"
              options={Object.values(LanguageTestEnum).map((value) => ({
                value: value,
                label: value,
              }))}
            />
          )}
        />
        {errors.testType && <p className="mt-1 text-red-500 typo-regular-2">{errors.testType.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-serif typo-sb-7">점수</label>
        <input
          type="text"
          className="flex h-10 items-center rounded-lg bg-k-50 px-5 py-2.5 font-serif text-secondary typo-sb-9"
          {...register("score")}
        />
        {errors.score && <p className="mt-1 text-red-500 typo-regular-2">{errors.score.message}</p>}
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
            href="/university/score/example/lang-cert"
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
            <p className="mt-2 text-k-500 typo-medium-2">지원에 사용할 어학 성적과 증명서를 제출하세요.</p>
          </header>

          <div className="grid items-start gap-8 xl:grid-cols-[minmax(460px,600px)_minmax(300px,360px)]">
            <section className="rounded-lg border border-k-100 bg-white p-8">
              <SubmitLinkTab isActiveGpa={false} variant="desktop" />
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                {formTitle}
                {formFields}
                <div className="mt-8">{submitButton}</div>
              </form>
            </section>

            <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
              <h2 className="text-k-900 typo-bold-4">제출 전 확인</h2>
              <div className="mt-5 grid gap-3 text-k-700 typo-medium-2">
                <div className="rounded-lg bg-k-50 px-4 py-3">공식 인증 기간이 표시된 원본 파일을 업로드해 주세요.</div>
                <div className="rounded-lg bg-k-50 px-4 py-3">승인 완료 전까지는 지원서에서 사용할 수 없습니다.</div>
                <div className="rounded-lg bg-k-50 px-4 py-3">잘못된 서류는 승인 거절될 수 있습니다.</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubmitLinkTab isActiveGpa={false} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-5 pt-[30px]">
          {formTitle}
          {formFields}
        </div>
        <div className="mt-10 w-full max-w-app px-5 md:max-w-none">
          <div className="mb-10">{submitButton}</div>
        </div>
      </form>
    </>
  );
};

const LanguageTestSubmitPage = () => {
  return (
    <Suspense fallback={<CloudSpinnerPage />}>
      <LanguageTestSubmitForm />
    </Suspense>
  );
};
export default LanguageTestSubmitPage;

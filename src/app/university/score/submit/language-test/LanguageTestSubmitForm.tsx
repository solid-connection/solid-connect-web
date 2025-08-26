"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import clsx from "clsx";

import SubmitLinkTab from "@/components/score/SubmitLinkTab";
import SubmitResult from "@/components/score/SubmitResult";
// CustomDropdown 경로 확인 필요
import { InfoRowProps } from "@/components/score/SubmitResult";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

import { LanguageTestFormData, languageTestSchema } from "./_lib/schema";

import { LanguageTestEnum } from "@/types/score";

import { usePostLanguageTestScore } from "@/api/score/client/usePostLanguageTestScore";
import CustomDropdown from "@/app/university/CustomDropdown";
import { zodResolver } from "@hookform/resolvers/zod";

const LanguageTestSubmitForm = () => {
  const router = useRouter();
  const [showResult, setShowResult] = useState(false);
  const { mutateAsync: postLanguageTestScore } = usePostLanguageTestScore();
  const [submittedData, setSubmittedData] = useState<LanguageTestFormData | null>(null);

  // 3. react-hook-form 설정
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<LanguageTestFormData>({
    resolver: zodResolver(languageTestSchema),
    mode: "onChange", // 입력값이 변경될 때마다 유효성 검사
  });

  const selectedFile = watch("file");

  // 4. 폼 제출 핸들러
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

      // 성공 시에만 실행
      reset();
      setShowResult(true);
      setSubmittedData(data);
    } catch (error) {
      // 실패 시 처리 (알림, 로그 등)
      console.error("어학 성적 제출 실패:", error);
      alert("제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (showResult && submittedData) {
    const infoRows: InfoRowProps[] = [
      {
        label: "공인어학",
        status: "TOEIC",
        details: `${submittedData.score}/500`,
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
        onClick={() => router.push("/university/score/submit/gpa")}
        handleClose={() => setShowResult(false)}
        infoRows={infoRows}
      />
    );
  }

  return (
    <>
      <SubmitLinkTab isActiveGpa={false} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-5 pt-[30px]">
          <div>
            <p className="font-serif text-[22px] font-bold leading-normal text-k-900">어학 성적 입력</p>
            <p className="font-serif text-[13px] font-medium leading-normal text-k-600">
              공적 증명서만 인정됩니다.
              <br />
              미인정 서류를 업로드 할 경우 권한이 거부될 수 있습니다.
            </p>
          </div>

          <div className="mt-[30px] flex flex-col gap-5">
            {/* 어학 종류 드롭다운 */}
            <div className="flex flex-col gap-1">
              <label className="font-serif text-base font-semibold leading-normal">어학 종류</label>
              {/* 5. Controller로 CustomDropdown 연동 */}
              <Controller
                name="testType"
                control={control}
                render={({ field }) => (
                  <CustomDropdown
                    placeholderSelect=""
                    value={field.value}
                    onChange={field.onChange} // ❌ setValue -> ✅ onChange 로 수정
                    placeholder="어학 종류를 선택해주세요"
                    options={Object.values(LanguageTestEnum).map((value) => ({
                      value: value,
                      label: value,
                    }))}
                  />
                )}
              />
              {errors.testType && <p className="mt-1 text-sm text-red-500">{errors.testType.message}</p>}
            </div>

            {/* 점수 입력 */}
            <div className="flex flex-col gap-1">
              <label className="font-serif text-base font-semibold leading-normal">점수</label>
              <input
                type="text"
                className="flex h-10 items-center rounded-lg bg-k-50 px-5 py-2.5 font-serif text-sm font-semibold leading-normal text-secondary"
                {...register("score")}
              />
              {errors.score && <p className="mt-1 text-sm text-red-500">{errors.score.message}</p>}
            </div>

            {/* 증명서 첨부 */}
            <div className="flex flex-col gap-1">
              <label className="font-serif text-base font-semibold leading-normal">증명서 첨부</label>
              <div className="flex items-center gap-3">
                <span className="flex h-10 flex-1 items-center truncate rounded-lg bg-k-50 px-5 py-2.5 font-serif text-sm font-semibold leading-normal text-secondary">
                  {selectedFile?.[0]?.name || "파일을 선택해주세요."}
                </span>
              </div>
              {errors.file && <p className="mt-1 text-sm text-red-500">{errors.file.message as string}</p>}
              <div className="mt-2 flex items-center gap-4">
                <label className="cursor-pointer rounded-full bg-sub-c-100 px-4 py-2.5 font-serif text-sm font-semibold leading-normal text-sub-c-500">
                  증명서 첨부
                  <input id="file-upload" type="file" className="hidden" {...register("file")} />
                </label>
                <Link
                  href="/university/score/example/lang-cert"
                  target="_blank"
                  className="rounded-full bg-sub-e-100 px-4 py-2.5 text-sm font-semibold text-sub-e-500"
                >
                  증명서 예시 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 w-full max-w-[600px] px-5">
          <button
            className={clsx(
              "mb-10 w-full rounded-lg py-4 font-semibold text-white",
              isValid ? "cursor-not-allowed bg-primary" : "bg-k-100",
            )}
            type="submit"
            disabled={!isValid}
          >
            다음
          </button>
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

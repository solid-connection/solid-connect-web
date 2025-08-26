"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import clsx from "clsx";
import { z } from "zod";

import { validateLanguageScore } from "@/utils/scoreUtils";

import SubmitLinkTab from "@/components/score/SubmitLinkTab";
import SubmitResult from "@/components/score/SubmitResult";
// CustomDropdown 경로 확인 필요
import { InfoRowProps } from "@/components/score/SubmitResult";

import { LanguageTestEnum } from "@/types/score";

import { usePostLanguageTestScore } from "@/api/score/client/usePostLanguageTestScore";
import CustomDropdown from "@/app/university/CustomDropdown";
import { zodResolver } from "@hookform/resolvers/zod";

// 1. Zod 스키마 정의: 폼 데이터의 유효성 규칙
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const languageTestSchema = z
  .object({
    testType: z.nativeEnum(LanguageTestEnum).refine((val) => !!val, {
      message: "어학 종류를 선택해주세요.",
    }),
    score: z.string().min(1, "점수를 입력해주세요."),
    file: z
      .instanceof(FileList)
      .refine((files) => files?.length === 1, "증명서 파일을 첨부해주세요.")
      .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `파일 크기는 5MB를 초과할 수 없습니다.`)
      .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), ".jpeg, .png, .pdf 파일만 지원합니다."),
  })
  .refine(
    (data) => {
      // 2. 여러 필드에 걸친 복합 유효성 검사 (점수 범위)
      try {
        validateLanguageScore(data.testType, data.score);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "입력한 점수가 유효한 범위에 있는지 확인해주세요.",
      path: ["score"], // 오류가 발생할 필드를 지정
    },
  );

// Zod 스키마로부터 TypeScript 타입 추론
type LanguageTestFormData = z.infer<typeof languageTestSchema>;

const LanguageTestSubmitForm = () => {
  const router = useRouter();
  const [showResult, setShowResult] = useState(false);
  const { mutateAsync: postLanguageTestScore, isSuccess } = usePostLanguageTestScore();

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 4. 폼 제출 핸들러
  const onSubmit: SubmitHandler<LanguageTestFormData> = async (data) => {
    await postLanguageTestScore({
      languageTestScoreRequest: {
        languageTestType: data.testType,
        languageTestScore: data.score,
        issueDate: "2025-01-01", // TODO: 실제 날짜 데이터로 변경
      },
      file: data.file[0], // FileList에서 실제 File 객체 추출
    });
    if (!isSuccess) return;

    setShowResult(true);
    reset();
  };

  const watcehdScore = watch("score");
  const watchedFileName = watch("file")?.[0]?.name || "";
  if (showResult) {
    const infoRows: InfoRowProps[] = [
      {
        label: "공인어학",
        status: "TOEIC",
        details: `${watcehdScore}/500`,
      },
      {
        label: "어학증명서",
        status: "제출 완료",
        details: watchedFileName,
      },
    ];

    return (
      <SubmitResult
        title="어학 성적 제출 완료"
        description="제출해주신 어학 성적은 검토 후 승인 처리됩니다. 결과는 마이페이지에서 확인할 수 있습니다."
        buttonText="학점입력하기"
        onClick={() => router.push("/score/submit/gpa")}
        handleClose={() => setShowResult(false)}
        infoRows={infoRows}
      />
    );
  }

  return (
    <>
      <SubmitLinkTab />
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
                  href="/score/example/lang-cert"
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

export default LanguageTestSubmitForm;

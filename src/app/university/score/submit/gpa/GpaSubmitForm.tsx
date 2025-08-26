"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import clsx from "clsx";

import SubmitLinkTab from "@/components/score/SubmitLinkTab";
import SubmitResult from "@/components/score/SubmitResult";
import { InfoRowProps } from "@/components/score/SubmitResult";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

// CustomDropdown 경로 확인 필요
import { GpaFormData, gpaSchema } from "./_lib/schema";

import { usePostGpaScore } from "@/api/score/client/usePostGpaScore";
import CustomDropdown from "@/app/university/CustomDropdown";
import { zodResolver } from "@hookform/resolvers/zod";

const GpaSubmitForm = () => {
  const router = useRouter();
  const [showResult, setShowResult] = useState(false);
  const [submittedData, setSubmittedData] = useState<GpaFormData | null>(null);
  const { mutateAsync: postGpaScore } = usePostGpaScore();

  // 2. react-hook-form 설정
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

  // 3. 폼 제출 핸들러
  const onSubmit: SubmitHandler<GpaFormData> = async (data) => {
    await postGpaScore({
      gpaScoreRequest: {
        gpa: Number(data.gpa),
        gpaCriteria: Number(data.gpaCriteria),
        issueDate: "2025-01-01", // TODO: 실제 날짜 데이터로 변경
      },
      file: data.file[0],
    });
    // 성공 시, 결과 화면에 보여줄 데이터를 저장하고 상태 변경
    setSubmittedData(data);
    setShowResult(true);
    reset();
  };

  if (showResult && submittedData) {
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
        details: submittedData.file[0].name,
      },
    ];

    return (
      <SubmitResult
        title="학점 입력 완료"
        description="지원은 총 3번만 가능하며, 제출 완료 후 성적을 변경 하실 수 없습니다."
        buttonText="어학성적 입력하기"
        onClick={() => router.push("/university/score/submit/language-test")}
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
            <p className="font-serif text-[22px] font-bold leading-normal text-k-900">대학교 성적 입력</p>
            <p className="font-serif text-[13px] font-medium leading-normal text-k-600">
              공적 증명서만 인정됩니다.
              <br />
              미인정 서류를 업로드 할 경우 권한이 거부될 수 있습니다.
            </p>
          </div>

          <div className="mt-[30px] flex flex-col gap-5">
            {/* 학점 기준 드롭다운 */}
            <div className="flex flex-col gap-1">
              <label className="font-serif text-base font-semibold leading-normal">학점 기준</label>
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
              {errors.gpaCriteria && <p className="mt-1 text-sm text-red-500">{errors.gpaCriteria.message}</p>}
            </div>

            {/* 점수 입력 */}
            <div className="flex flex-col gap-1">
              <label className="font-serif text-base font-semibold leading-normal">점수</label>
              <input
                type="number"
                step="0.01" // 소수점 두 자리까지 입력 가능하도록 설정
                className="flex h-10 items-center rounded-lg bg-k-50 px-5 py-2.5 font-serif text-sm font-semibold leading-normal text-secondary"
                {...register("gpa")}
              />
              {errors.gpa && <p className="mt-1 text-sm text-red-500">{errors.gpa.message}</p>}
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
                  href="/university/score/example/gpa-cert"
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

const GpaSubmitPage = () => {
  return (
    <Suspense fallback={<CloudSpinnerPage />}>
      <GpaSubmitForm />
    </Suspense>
  );
};
export default GpaSubmitPage;

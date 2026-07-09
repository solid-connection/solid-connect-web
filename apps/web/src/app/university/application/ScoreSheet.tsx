"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import Image from "@/components/ui/FallbackImage";
import { IconExpandMoreFilled } from "@/public/svgs/community";
import type { Applicant, ScoreSheet as ScoreSheetType } from "@/types/application";
import { formatLanguageTestScore, isLanguageTestEnum, languageTestMapping } from "@/types/score";

type ScoreSheetProps = {
  scoreSheet: ScoreSheetType;
  defaultOpen?: boolean;
  detailHref?: string;
};

export const getApplicationDetailHref = (koreanName: string) =>
  `/university/application/${encodeURIComponent(koreanName)}`;

export const formatApplicantGpa = (gpa: number | null | undefined) => {
  if (typeof gpa !== "number" || Number.isNaN(gpa)) {
    return "-";
  }

  return gpa.toFixed(1);
};

export const formatApplicantLanguageTest = (applicant: Pick<Applicant, "testType" | "testScore">) => {
  const testName = isLanguageTestEnum(applicant.testType)
    ? languageTestMapping[applicant.testType]
    : applicant.testType;
  const score = isLanguageTestEnum(applicant.testType)
    ? formatLanguageTestScore(applicant.testType, applicant.testScore)
    : applicant.testScore;

  if (!testName || !score) {
    return "-";
  }

  return `${testName} ${score}`;
};

export const formatApplicantLanguageTestName = (testType: string) => {
  return isLanguageTestEnum(testType) ? languageTestMapping[testType] : testType;
};

export const formatApplicantLanguageScore = (applicant: Pick<Applicant, "testType" | "testScore">) => {
  if (!applicant.testScore) {
    return "-";
  }

  return isLanguageTestEnum(applicant.testType)
    ? formatLanguageTestScore(applicant.testType, applicant.testScore)
    : applicant.testScore;
};

const getScoreSheetCapacity = (scoreSheet: ScoreSheetType) => {
  if (scoreSheet.studentCapacity === null || scoreSheet.studentCapacity === undefined) {
    return "미정";
  }

  return String(scoreSheet.studentCapacity);
};

export const ScoreSheetLogo = ({
  scoreSheet,
  className,
  size = 20,
}: {
  scoreSheet: Pick<ScoreSheetType, "logoImageUrl">;
  className?: string;
  size?: number;
}) => (
  <Image
    src={scoreSheet.logoImageUrl ?? ""}
    alt=""
    width={size}
    height={size}
    className={clsx("shrink-0 rounded-full border border-k-50 bg-white object-cover", className)}
    fallbackSrc="/svgs/placeholders/university-logo-placeholder.svg"
    aria-hidden
  />
);

export const MobileScoreSheet = ({ scoreSheet, defaultOpen = false, detailHref }: ScoreSheetProps) => {
  const [tableOpened, setTableOpened] = useState(defaultOpen);
  const resolvedDetailHref = detailHref ?? getApplicationDetailHref(scoreSheet.koreanName);
  const capacity = getScoreSheetCapacity(scoreSheet);
  const toggleTableOpened = () => setTableOpened((prev) => !prev);

  return (
    <article
      className={clsx(
        "w-full overflow-hidden rounded-lg",
        tableOpened ? "border border-secondary-300 bg-white" : "bg-k-50",
      )}
    >
      <div
        className={clsx(
          "flex min-h-11 w-full cursor-pointer items-center gap-2.5 px-4",
          tableOpened ? "bg-secondary-100" : "bg-k-50",
        )}
        onClick={toggleTableOpened}
      >
        <ScoreSheetLogo scoreSheet={scoreSheet} className="size-5" />
        <Link
          href={resolvedDetailHref}
          className="min-w-0 flex-1 truncate text-k-900 typo-sb-7"
          onClick={(event) => event.stopPropagation()}
        >
          {scoreSheet.koreanName} ({scoreSheet.applicants.length}/{capacity})
        </Link>
        <button
          onClick={(event) => {
            event.stopPropagation();
            toggleTableOpened();
          }}
          className="flex size-6 shrink-0 items-center justify-center text-k-600"
          type="button"
          aria-label={`${scoreSheet.koreanName} 지원자 목록 ${tableOpened ? "접기" : "펼치기"}`}
        >
          <IconExpandMoreFilled className={`transition-transform duration-300 ${tableOpened ? "rotate-180" : ""}`} />
        </button>
      </div>

      {tableOpened ? (
        <div className="bg-white">
          {scoreSheet.applicants.map((applicant, index) => (
            <ApplicantInlineRow key={`${applicant.nicknameForApply}-${index}`} applicant={applicant} />
          ))}
        </div>
      ) : null}
    </article>
  );
};

const ApplicantInlineRow = ({ applicant }: { applicant: Applicant }) => (
  <div className="grid min-h-[46px] grid-cols-[1fr_54px_1fr_54px] items-center px-9 text-k-700 typo-regular-3">
    <span className="truncate text-k-900">{applicant.nicknameForApply}</span>
    <span className="text-center">{formatApplicantGpa(applicant.gpa)}</span>
    <span className="truncate text-center text-k-900">{formatApplicantLanguageTestName(applicant.testType)}</span>
    <span className="truncate text-right">{formatApplicantLanguageScore(applicant)}</span>
  </div>
);

export default MobileScoreSheet;

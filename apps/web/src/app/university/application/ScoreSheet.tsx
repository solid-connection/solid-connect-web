import clsx from "clsx";
import { useState } from "react";
import { IconExpandMoreFilled } from "@/public/svgs/community";
import type { ScoreSheet as ScoreSheetType } from "@/types/application";
import { formatLanguageTestScore, isLanguageTestEnum, languageTestMapping } from "@/types/score";

const ScoreSheet = ({
  scoreSheet,
  variant = "mobile",
}: {
  scoreSheet: ScoreSheetType;
  variant?: "mobile" | "desktop";
}) => {
  const [tableOpened, setTableOpened] = useState(false);
  const isDesktop = variant === "desktop";

  return (
    <div
      className={clsx("w-full overflow-hidden rounded-lg bg-white", isDesktop ? "border border-k-100" : "shadow-sdwB")}
    >
      <button
        onClick={() => setTableOpened(!tableOpened)}
        className={clsx(
          "flex w-full items-center justify-between border-b border-k-50 bg-k-50 text-left",
          isDesktop ? "min-h-14 px-5" : "min-h-12 px-4",
        )}
        type="button"
      >
        <p className={clsx("truncate text-k-900", isDesktop ? "typo-sb-5" : "typo-sb-7")}>
          {scoreSheet.koreanName} ({scoreSheet.applicants.length}/{scoreSheet.studentCapacity})
        </p>
        <span className="flex h-6 w-6 items-center justify-center">
          <IconExpandMoreFilled className={`transition-transform duration-300 ${tableOpened ? "rotate-180" : ""}`} />
        </span>
      </button>

      {tableOpened ? (
        <div className="divide-y divide-k-50">
          {scoreSheet.applicants.map((applicant) => (
            <div
              key={applicant.nicknameForApply}
              className={clsx("flex min-h-12 items-center text-k-600 typo-medium-3", isDesktop ? "px-5" : "px-4")}
            >
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-k-900 typo-regular-2">
                {applicant.nicknameForApply}
              </span>
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-center typo-medium-2">
                {applicant.gpa.toFixed(2)}
              </span>
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-center typo-medium-2">
                {isLanguageTestEnum(applicant.testType) ? languageTestMapping[applicant.testType] : applicant.testType}
              </span>
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-center typo-medium-2">
                {isLanguageTestEnum(applicant.testType)
                  ? formatLanguageTestScore(applicant.testType, applicant.testScore)
                  : applicant.testScore}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ScoreSheet;

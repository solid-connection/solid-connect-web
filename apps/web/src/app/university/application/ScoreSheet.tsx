import { useState } from "react";
import { IconExpandMoreFilled } from "@/public/svgs/community";
import type { ScoreSheet as ScoreSheetType } from "@/types/application";
import { languageTestMapping } from "@/types/score";

const ScoreSheet = ({ scoreSheet }: { scoreSheet: ScoreSheetType }) => {
  const [tableOpened, setTableOpened] = useState(false);

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-sdwB">
      <button
        onClick={() => setTableOpened(!tableOpened)}
        className="flex min-h-12 w-full items-center justify-between border-b border-k-50 bg-k-50 px-4 text-left"
        type="button"
      >
        <p className="truncate text-k-900 typo-sb-7">
          {scoreSheet.koreanName} ({scoreSheet.applicants.length}/{scoreSheet.studentCapacity})
        </p>
        <span className="flex h-6 w-6 items-center justify-center">
          <IconExpandMoreFilled className={`transition-transform duration-300 ${tableOpened ? "rotate-180" : ""}`} />
        </span>
      </button>

      {tableOpened ? (
        <div className="divide-y divide-k-50">
          {scoreSheet.applicants.map((applicant) => (
            <div key={applicant.nicknameForApply} className="flex min-h-12 items-center px-4 text-k-600 typo-medium-3">
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-k-900 typo-regular-2">
                {applicant.nicknameForApply}
              </span>
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-center typo-medium-2">
                {applicant.gpa.toFixed(2)}
              </span>
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-center typo-medium-2">
                {languageTestMapping[applicant.testType]}
              </span>
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-center typo-medium-2">
                {applicant.testScore}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ScoreSheet;

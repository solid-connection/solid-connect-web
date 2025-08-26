import { useState } from "react";

import type { ScoreSheet } from "@/types/application";
import { languageTestMapping } from "@/types/score";

import { IconExpandMoreFilled } from "@/public/svgs/community";

const ScoreSheet = ({ scoreSheet }: { scoreSheet: ScoreSheet }) => {
  const [tableOpened, setTableOpened] = useState(false);

  return (
    // 테이블 전체 컨테이너
    <button
      onClick={() => setTableOpened(!tableOpened)}
      className="w-full overflow-hidden rounded-lg border border-gray-200"
    >
      {/* 테이블 헤더 */}
      <div className="flex h-10 items-center justify-between bg-gray-50 px-4">
        <p className="truncate text-base font-semibold text-black">
          {scoreSheet.koreanName} ({scoreSheet.applicants.length}/{scoreSheet.studentCapacity})
        </p>
        <button type="button" aria-label="더보기" className="cursor-pointer border-none bg-transparent p-1">
          <IconExpandMoreFilled className={`transition-transform duration-300 ${tableOpened ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* 테이블 바디 (토글) */}
      {tableOpened && (
        <div className="divide-y divide-gray-200">
          {scoreSheet.applicants.map((applicant) => (
            <div
              key={applicant.nicknameForApply}
              className="flex h-10 items-center px-3 text-[13px] font-medium text-[#4d4d4d]"
            >
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-sm font-normal text-black">
                {applicant.nicknameForApply}
              </span>
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-center">
                {applicant.gpa.toFixed(2)}
              </span>
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-center">
                {languageTestMapping[applicant.testType]}
              </span>
              <span className="min-w-[30px] flex-1 overflow-hidden whitespace-nowrap text-center">
                {applicant.testScore}
              </span>
              <span className="flex w-[18px] flex-none items-center justify-center">
                {/* {applicant.isMine && (
                  <Link href="/university/application/apply">
                    <IconEditFilled />
                  </Link>
                )} */}
              </span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
};

export default ScoreSheet;

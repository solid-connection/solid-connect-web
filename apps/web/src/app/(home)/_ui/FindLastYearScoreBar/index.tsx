"use client";

import { toast } from "@/lib/zustand/useToastStore";
import { IconGraduationCap, IconRightArrow } from "@/public/svgs/home";

const FindLastYearScoreBar = () => {
  return (
    <button
      className="h-15 flex w-full cursor-pointer items-center justify-between border-b border-k-100 px-5 py-3 focus:outline-none"
      onClick={() => toast.error("해당 기능은 현재 준비중입니다.")}
    >
      <div>
        <div className="flex items-center gap-4">
          <IconGraduationCap />
          <div className="flex flex-col">
            <span className="text-k-800 typo-regular-4">작년 합격 점수가 궁금하신가요?</span>
            <span className="text-k-800 typo-sb-9">작년도 합격 점수 확인하러 가기</span>
          </div>
        </div>
      </div>
      <IconRightArrow />
    </button>
  );
};
export default FindLastYearScoreBar;

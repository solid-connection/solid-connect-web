import Link from "next/link";

import { IconIdCard, IconMagnifyingGlass, IconMuseum, IconPaper } from "@/public/svgs/home";

const HomeActionLinks = () => {
  return (
    <div className="flex flex-col gap-2.5 px-5 py-3.5">
      <div className="flex gap-2">
        <Link className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-bg-accent-blue p-2.5" href="/university/search">
          <div className="flex flex-col">
            <span className="text-secondary typo-bold-5">학교 검색하기</span>
            <span className="text-k-700 typo-medium-4">모든 학교 목록을 확인해보세요</span>
          </div>
          <div className="flex justify-end">
            <IconMagnifyingGlass />
          </div>
        </Link>
        <Link className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-bg-accent-sky p-2.5" href="/university/score">
          <div className="flex flex-col">
            <span className="text-sub-a typo-bold-5">성적 입력하기</span>
            <span className="text-k-700 typo-medium-4">성적을 입력해보세요</span>
          </div>
          <div className="flex justify-end">
            <IconPaper />
          </div>
        </Link>
      </div>
      <div className="flex gap-2">
        <Link
          className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-bg-accent-orange p-2.5"
          href="/university/application/apply"
        >
          <div className="flex flex-col">
            <span className="text-accent-custom-orange typo-bold-5">학교 지원하기</span>
            <span className="text-k-700 typo-medium-4">학교를 지원해주세요</span>
          </div>
          <div className="flex justify-end">
            <IconMuseum />
          </div>
        </Link>
        <Link
          className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-bg-accent-green p-2.5"
          href="/university/application"
        >
          <div className="flex flex-col">
            <span className="text-accent-custom-green typo-bold-5">지원자 현황 확인</span>
            <span className="text-k-700 typo-medium-4">경쟁률을 바로 분석해드려요</span>
          </div>
          <div className="flex justify-end">
            <IconIdCard />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomeActionLinks;

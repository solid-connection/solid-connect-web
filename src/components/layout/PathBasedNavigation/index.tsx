"use client";

import { usePathname, useRouter } from "next/navigation";

import getTitle from "./lib/getTitle";

import { IconArrowBackFilled } from "@/public/svgs";

interface PathBasedNavigationProps {
  handleBack?: () => void;
  icon?: React.ReactNode;
  customTitles?: Record<string, string>; // 커스텀 타이틀 추가 가능
  dynamicRoutePatterns?: Array<{
    pattern: RegExp;
    titleKey: string;
  }>;
}

const PathBasedNavigation = ({
  handleBack,
  icon,
  customTitles = {},
  dynamicRoutePatterns = [],
}: PathBasedNavigationProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const routeBack = () => {
    router.back(); // 라우터의 back 함수를 사용하여 이전 페이지로 이동
  };

  // 최상단의 layout.tsx에서 커스텀 타이틀과 동적 라우트 패턴을 사용하여 제목을 가져옴
  const title = getTitle({
    pathname,
    customTitles,
    dynamicRoutePatterns,
  });

  // title이 없으면 헤더를 렌더링하지 않음
  if (!title) {
    return null;
  }

  return (
    <div className="fixed top-0 z-30 box-border flex h-14 w-full max-w-[600px] items-center justify-between bg-white px-5">
      <button className="min-w-6 cursor-pointer" onClick={handleBack || routeBack} type="button" aria-label="뒤로 가기">
        <IconArrowBackFilled />
      </button>
      <div className="font-serif text-base font-semibold leading-[160%] text-[rgba(0,0,0,0.87)]">{title}</div>
      <div className="min-w-6 cursor-pointer">{icon}</div>
    </div>
  );
};

export default PathBasedNavigation;

"use client";

import { usePathname, useRouter } from "next/navigation";

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
  const getTitle = (): string => {
    if (!pathname) return "";

    // 1. 정확한 매칭만 확인
    if (pathname in customTitles) {
      return customTitles[pathname];
    }

    // 2. 부분 매칭 확인 (예: /mento/chat/123 -> /mento/chat/) - 키가 /로 끝나는 경우만
    const matchingKeys = Object.keys(customTitles)
      .filter((key) => key.endsWith("/") && pathname.startsWith(key))
      .sort((a, b) => b.length - a.length); // 가장 긴 매칭 우선

    if (matchingKeys.length > 0) {
      return customTitles[matchingKeys[0]];
    }

    // 3. 커스텀 동적 라우트 패턴 매칭
    for (const { pattern, titleKey } of dynamicRoutePatterns) {
      if (pattern.test(pathname) && titleKey in customTitles) {
        return customTitles[titleKey];
      }
    }

    // 4. customTitles에 없으면 빈 문자열 반환
    return "";
  };

  const title = getTitle();

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

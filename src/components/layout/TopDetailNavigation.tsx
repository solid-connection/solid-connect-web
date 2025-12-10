"use client";

import { useRouter } from "next/navigation";

import { IconArrowBackFilled } from "@/public/svgs";

interface TopDetailNavigationProps {
  title: string;
  handleBack?: () => void;
  icon?: React.ReactNode;
}

const TopDetailNavigation = ({ title, handleBack, icon }: TopDetailNavigationProps) => {
  const router = useRouter();

  const routeBack = () => {
    router.back(); // 라우터의 back 함수를 사용하여 이전 페이지로 이동
  };

  return (
    <div className="max-w-app fixed top-0 z-30 box-border flex h-14 w-full items-center justify-between bg-white px-5">
      <button className="min-w-6 cursor-pointer" onClick={handleBack || routeBack} type="button" aria-label="뒤로 가기">
        <IconArrowBackFilled />
      </button>
      <div className="font-serif typo-sb-7 text-[rgba(0,0,0,0.87)]">{title}</div>
      <div className="min-w-6 cursor-pointer">{icon}</div>
    </div>
  );
};

export default TopDetailNavigation;

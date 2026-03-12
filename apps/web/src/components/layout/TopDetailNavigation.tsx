"use client";

import { useRouter } from "next/navigation";

import { IconArrowBackFilled } from "@/public/svgs";

export interface TopDetailNavigationProps {
  title: string;
  handleBack?: () => void;
  backHref?: string;
  icon?: React.ReactNode;
}

const TopDetailNavigation = ({ title, handleBack, backHref, icon }: TopDetailNavigationProps) => {
  const router = useRouter();

  const routeBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back(); // 라우터의 back 함수를 사용하여 이전 페이지로 이동
    }
  };

  return (
    <div className="fixed top-0 z-30 box-border flex h-14 w-full max-w-app items-center justify-between bg-white px-5">
      <button className="min-w-6 cursor-pointer" onClick={handleBack || routeBack} type="button" aria-label="뒤로 가기">
        <IconArrowBackFilled />
      </button>
      <div className="text-black/87 font-serif typo-sb-7">{title}</div>
      <div className="min-w-6 cursor-pointer">{icon}</div>
    </div>
  );
};

export default TopDetailNavigation;

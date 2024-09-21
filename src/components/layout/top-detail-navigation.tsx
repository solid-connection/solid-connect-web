import { useRouter } from "next/router";

import ArrowBackFilled from "@/components/ui/icon/ArrowBackFilled";

interface TopDetailNavigationProps {
  title: string;
  handleBack?: any;
  icon?: any;
}

export default function TopDetailNavigation({ title, handleBack, icon = null }: TopDetailNavigationProps) {
  const router = useRouter();

  const routeBack = () => {
    router.back(); // 라우터의 back 함수를 사용하여 이전 페이지로 이동
  };

  return (
    <div className="fixed top-0 z-[100] box-border flex h-14 w-full max-w-[600px] items-center justify-between bg-white px-5">
      <div className="min-w-6 cursor-pointer" onClick={handleBack || routeBack}>
        <ArrowBackFilled />
      </div>
      <div className="font-serif text-base font-semibold leading-[160%] text-[rgba(0,0,0,0.87)]">{title}</div>
      <div className="min-w-6 cursor-pointer">{icon}</div>
    </div>
  );
}

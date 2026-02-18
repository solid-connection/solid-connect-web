import Link from "next/link";

import { IconSolidConnectionSmallLogo } from "@/public/svgs/my";

interface UniversityDetailPreparingFallbackProps {
  backHref: string;
}

const UniversityDetailPreparingFallback = ({ backHref }: UniversityDetailPreparingFallbackProps) => {
  return (
    <div
      className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-5 pb-24 pt-20 text-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <IconSolidConnectionSmallLogo />
      <p className="mt-3 text-k-700 typo-sb-9">대학 정보를 준비중입니다.</p>
      <p className="mt-1 text-k-400 typo-regular-3">아직 데이터가 준비되지 않았어요. 잠시 후 다시 확인해주세요.</p>
      <Link
        href={backHref}
        className="mt-5 rounded-full border border-k-200 bg-k-0 px-5 py-2 text-k-700 typo-sb-11 transition-colors hover:bg-k-50"
      >
        파견학교 목록으로 돌아가기
      </Link>
    </div>
  );
};

export default UniversityDetailPreparingFallback;

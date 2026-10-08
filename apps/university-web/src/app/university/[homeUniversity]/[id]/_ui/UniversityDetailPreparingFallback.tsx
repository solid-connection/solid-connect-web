import Link from "next/link";

import { IconSolidConnectionSmallLogo } from "@/public/svgs/my";

interface UniversityDetailPreparingFallbackProps {
  backHref: string;
  title?: string;
  description?: string;
}

const UniversityDetailPreparingFallback = ({
  backHref,
  title = "대학 정보를 준비중입니다.",
  description = "아직 데이터가 준비되지 않았어요. 잠시 후 다시 확인해주세요.",
}: UniversityDetailPreparingFallbackProps) => {
  return (
    <>
      <div
        className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-5 pb-24 pt-20 text-center md:hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <IconSolidConnectionSmallLogo />
        <p className="mt-3 text-k-700 typo-sb-9">{title}</p>
        <p className="mt-1 text-k-400 typo-regular-3">{description}</p>
        <Link
          href={backHref}
          className="mt-5 rounded-full border border-k-200 bg-k-0 px-5 py-2 text-k-700 typo-sb-11 transition-colors hover:bg-k-50"
        >
          파견학교 목록으로 돌아가기
        </Link>
      </div>

      <div
        className="hidden min-h-screen items-center justify-center bg-k-50 px-8 py-16 md:flex lg:px-10"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <section className="w-full max-w-3xl rounded-lg border border-k-100 bg-white p-10 text-center shadow-sm">
          <div className="flex justify-center">
            <IconSolidConnectionSmallLogo />
          </div>
          <p className="mt-4 text-k-900 typo-bold-2">{title}</p>
          <p className="mt-2 text-k-500 typo-medium-3">{description}</p>
          <Link
            href={backHref}
            className="mt-7 inline-flex rounded-lg border border-k-100 bg-k-0 px-5 py-3 text-k-700 typo-sb-9 transition-colors hover:border-primary hover:text-primary"
          >
            파견학교 목록으로 돌아가기
          </Link>
        </section>
      </div>
    </>
  );
};

export default UniversityDetailPreparingFallback;

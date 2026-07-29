"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import Image from "@/components/ui/FallbackImage";
import { REGIONS_KO } from "@/constants/university";
import { IconExpandMoreFilled } from "@/public/svgs/community";
import type { ListUniversity } from "@/types/university";

const PREVIEW_ROW_COUNT = 8;

type RestrictedApplicationStatusViewProps = {
  universities?: ListUniversity[];
  isLoading?: boolean;
  guestOverlay?: ReactNode;
  onLockedRowClick?: () => void;
};

const RestrictedApplicationStatusView = ({
  universities = [],
  isLoading = false,
  guestOverlay,
  onLockedRowClick,
}: RestrictedApplicationStatusViewProps) => {
  const previewUniversities = universities.slice(0, PREVIEW_ROW_COUNT);
  const shouldShowSkeleton = isLoading || previewUniversities.length === 0;

  return (
    <main className="relative mx-auto min-h-[calc(100dvh-112px)] w-full max-w-app overflow-hidden px-5 pb-8 pt-5">
      <RestrictedParticipantBanner />
      <RestrictedScopeTabs totalUniversityCount={universities.length} />
      <RestrictedFilterChips />
      <div className="mt-3 flex flex-col gap-2" aria-busy={isLoading}>
        {shouldShowSkeleton
          ? Array.from({ length: PREVIEW_ROW_COUNT }, (_, index) => <RestrictedSkeletonRow key={index} />)
          : previewUniversities.map((university) => (
              <RestrictedUniversityRow key={university.id} university={university} onClick={onLockedRowClick} />
            ))}
      </div>
      {guestOverlay}
    </main>
  );
};

const RestrictedParticipantBanner = () => (
  <section className="rounded-lg bg-secondary-100 px-5 py-3">
    <div className="flex items-center gap-4">
      <div className="flex size-10 items-center justify-center text-[34px]" aria-hidden>
        🔥
      </div>
      <div className="min-w-0 text-k-800">
        <p className="typo-regular-4">솔리드 커넥션과 함께하고 있어요</p>
        <p className="mt-0.5 typo-sb-9">
          총 <MaskedValue label="비공개 참여자 수" />
          명이 성적 공유 참여중!
        </p>
      </div>
    </div>
  </section>
);

const RestrictedScopeTabs = ({ totalUniversityCount }: { totalUniversityCount: number }) => (
  <div className="mt-6 flex h-11 items-start justify-between">
    <RestrictedScopeTab>모든 대학 ({totalUniversityCount || "-"})</RestrictedScopeTab>
    <RestrictedScopeTab active>
      지원자 있는 대학 (<MaskedValue label="비공개 대학 수" />)
    </RestrictedScopeTab>
  </div>
);

const RestrictedScopeTab = ({ children, active = false }: { children: ReactNode; active?: boolean }) => (
  <div
    className={clsx(
      "flex h-11 flex-1 items-center justify-center border-b-2 typo-medium-2",
      active ? "border-primary text-k-900" : "border-transparent text-k-300",
    )}
  >
    {children}
  </div>
);

const RestrictedFilterChips = () => (
  <div className="mt-4 flex gap-2 overflow-hidden whitespace-nowrap pb-1" aria-hidden>
    {REGIONS_KO.map((region) => (
      <span key={region} className="rounded-full bg-k-50 px-3 py-[5px] text-k-300 typo-sb-12">
        {region}
      </span>
    ))}
    <span className="rounded-full bg-k-50 px-3 py-[5px] text-k-300 typo-sb-12">학점 높은 순</span>
  </div>
);

const RestrictedUniversityRow = ({ university, onClick }: { university: ListUniversity; onClick?: () => void }) => {
  const content = (
    <>
      <Image
        src={university.logoImageUrl}
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0 rounded-full border border-k-50 bg-white object-cover"
        fallbackSrc="/svgs/placeholders/university-logo-placeholder.svg"
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate text-left text-k-900 typo-sb-7">
        {university.koreanName} <MaskedValue label={`${university.koreanName} 비공개 지원자 수`} wide />
      </span>
      <IconExpandMoreFilled className="size-5 shrink-0 text-k-600" aria-hidden />
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex h-11 w-full items-center gap-2.5 rounded-lg bg-k-50 px-3.5"
      >
        {content}
      </button>
    );
  }

  return <div className="flex h-11 items-center gap-2.5 rounded-lg bg-k-50 px-3.5">{content}</div>;
};

const RestrictedSkeletonRow = () => (
  <div className="flex h-11 items-center gap-2.5 rounded-lg bg-k-50 px-3.5" aria-hidden>
    <span className="size-5 shrink-0 rounded-full bg-white" />
    <span className="h-4 w-40 rounded-full bg-k-100" />
    <span className="ml-auto h-2 w-3 rounded-full bg-k-100" />
  </div>
);

const MaskedValue = ({ label, wide = false }: { label: string; wide?: boolean }) => (
  <>
    <span
      aria-hidden
      className={clsx(
        "inline-block select-none rounded bg-k-100 align-middle text-transparent blur-[3px]",
        wide ? "h-4 w-10" : "h-3.5 w-6",
      )}
    >
      •••
    </span>
    <span className="sr-only">{label}</span>
  </>
);

export default RestrictedApplicationStatusView;

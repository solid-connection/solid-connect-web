"use client";

import { MobileHeroDetailShell } from "@solid-connect/ui";
import clsx from "clsx";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { useGetApplicationsList } from "@/apis/applications";
import Image from "@/components/ui/FallbackImage";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { showIconToast } from "@/lib/toast/showIconToast";
import { IconShare } from "@/public/svgs";
import type { Applicant, ScoreSheet as ScoreSheetType } from "@/types/application";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import { formatApplicantGpa, formatApplicantLanguageTest } from "../ScoreSheet";

type ApplicantSort = "preference" | "gpa";

type ApplicationUniversityDetailContentProps = {
  universityName: string;
};

const ApplicationUniversityDetailContent = ({ universityName }: ApplicationUniversityDetailContentProps) => {
  const [sortMode, setSortMode] = useState<ApplicantSort>("preference");
  const isDesktop = useIsDesktopViewport();
  const { data, isLoading } = useGetApplicationsList({ meta: SKIP_GLOBAL_ERROR_TOAST_META });
  const scoreSheet = useMemo(
    () => findScoreSheetWithApplicants(data?.choices ?? [], universityName),
    [data?.choices, universityName],
  );

  const applicants = useMemo(() => {
    if (!scoreSheet) return [];

    return [...scoreSheet.applicants].sort((a, b) => {
      if (sortMode === "gpa") {
        return b.gpa - a.gpa;
      }

      return (a.preferenceOrder ?? 999) - (b.preferenceOrder ?? 999);
    });
  }, [scoreSheet, sortMode]);

  if (isLoading || isDesktop === null) {
    return <ApplicationUniversityDetailSkeleton isDesktop={isDesktop === true} />;
  }

  if (!scoreSheet) {
    return <ApplicationUniversityDetailNotFound universityName={universityName} isDesktop={isDesktop} />;
  }

  if (isDesktop) {
    return (
      <DesktopApplicationUniversityDetail
        scoreSheet={scoreSheet}
        applicants={applicants}
        sortMode={sortMode}
        setSortMode={setSortMode}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-app bg-white">
      <MobileApplicationUniversityDetail
        scoreSheet={scoreSheet}
        applicants={applicants}
        sortMode={sortMode}
        setSortMode={setSortMode}
      />
    </div>
  );
};

const DesktopApplicationUniversityDetail = ({
  scoreSheet,
  applicants,
  sortMode,
  setSortMode,
}: {
  scoreSheet: ScoreSheetType;
  applicants: Applicant[];
  sortMode: ApplicantSort;
  setSortMode: (sortMode: ApplicantSort) => void;
}) => (
  <main className="desktop-page-shell">
    <section className="relative min-h-72 overflow-hidden rounded-lg border border-k-100 bg-k-900">
      <Image
        alt={`${scoreSheet.koreanName} 이미지`}
        src={normalizeImageUrlToUploadCdn(scoreSheet.backgroundImageUrl)}
        fill
        className="object-cover opacity-60"
        fallbackSrc="/svgs/placeholders/university-background-placeholder.svg"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
      <div className="relative flex min-h-72 flex-col justify-between p-8 text-k-0">
        <div className="flex justify-end">
          <ShareActionButton />
        </div>
        <div className="flex items-end gap-5">
          <UniversityLogo scoreSheet={scoreSheet} />
          <div className="min-w-0">
            <h1 className="truncate typo-bold-1">{scoreSheet.koreanName}</h1>
            <p className="mt-1 truncate text-k-100 typo-medium-2">{scoreSheet.englishName ?? ""}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[getCountryLabel(scoreSheet.country), getCapacityLabel(scoreSheet), `지원자 ${applicants.length}명`].map(
                (stat) => (
                  <span key={stat} className="rounded-lg bg-white/90 px-3 py-2 text-k-800 typo-sb-11">
                    {stat}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-lg border border-k-100 bg-white p-6">
        <ApplicantListSection applicants={applicants} sortMode={sortMode} setSortMode={setSortMode} isDesktop />
      </section>
      <aside className="desktop-sticky-panel rounded-lg border border-k-100 bg-white p-6">
        <h2 className="text-k-900 typo-bold-4">지원 현황 요약</h2>
        <dl className="mt-5 space-y-4">
          <DesktopSummaryMetric label="전체 지원자" value={`${applicants.length}명`} />
          <DesktopSummaryMetric label="모집 인원" value={getCapacityLabel(scoreSheet).replace("모집 ", "")} />
          <DesktopSummaryMetric label="국가" value={getCountryLabel(scoreSheet.country)} />
        </dl>
        <Link
          href="/university/application"
          className="mt-6 flex h-11 items-center justify-center rounded-lg bg-primary text-k-0 typo-sb-9"
        >
          전체 대학 보기
        </Link>
      </aside>
    </div>
  </main>
);

const DesktopSummaryMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 border-b border-k-50 pb-4 last:border-b-0 last:pb-0">
    <dt className="text-k-500 typo-medium-3">{label}</dt>
    <dd className="text-right text-k-900 typo-sb-7">{value}</dd>
  </div>
);

const MobileApplicationUniversityDetail = ({
  scoreSheet,
  applicants,
  sortMode,
  setSortMode,
}: {
  scoreSheet: ScoreSheetType;
  applicants: Applicant[];
  sortMode: ApplicantSort;
  setSortMode: (sortMode: ApplicantSort) => void;
}) => (
  <MobileHeroDetailShell
    rightAction={<ShareActionButton />}
    background={
      <Image
        alt={`${scoreSheet.koreanName} 이미지`}
        src={normalizeImageUrlToUploadCdn(scoreSheet.backgroundImageUrl)}
        fill
        className="object-cover"
        fallbackSrc="/svgs/placeholders/university-background-placeholder.svg"
        priority
      />
    }
    logo={<UniversityLogo scoreSheet={scoreSheet} />}
    title={scoreSheet.koreanName}
    subtitle={scoreSheet.englishName ?? ""}
    stats={[
      { key: "country", content: getCountryLabel(scoreSheet.country) },
      { key: "capacity", content: getCapacityLabel(scoreSheet) },
      { key: "applicants", content: `지원자 ${scoreSheet.applicants.length}명` },
    ]}
  >
    <ApplicantListSection applicants={applicants} sortMode={sortMode} setSortMode={setSortMode} />
  </MobileHeroDetailShell>
);

const ApplicantListSection = ({
  applicants,
  sortMode,
  setSortMode,
  isDesktop = false,
}: {
  applicants: Applicant[];
  sortMode: ApplicantSort;
  setSortMode: (sortMode: ApplicantSort) => void;
  isDesktop?: boolean;
}) => (
  <section className={clsx(!isDesktop && "pt-7")}>
    <h2 className="text-k-900 typo-bold-4">지원자 목록 ({applicants.length}명)</h2>
    <p className="mt-1 text-k-400 typo-regular-2">모든 지원자들의 성적 정보를 확인하세요.</p>
    <div className="mt-5 flex h-11">
      <ApplicantSortTab active={sortMode === "preference"} onClick={() => setSortMode("preference")}>
        지망 순위 순
      </ApplicantSortTab>
      <ApplicantSortTab active={sortMode === "gpa"} onClick={() => setSortMode("gpa")}>
        학점 순
      </ApplicantSortTab>
    </div>
    <div className={clsx("mt-4 gap-3", isDesktop ? "grid lg:grid-cols-2" : "flex flex-col")}>
      {applicants.map((applicant, index) => (
        <ApplicantScoreCard key={`${applicant.nicknameForApply}-${index}`} applicant={applicant} />
      ))}
    </div>
  </section>
);

const ApplicantSortTab = ({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      "flex flex-1 items-center justify-center border-b-2 typo-medium-2",
      active ? "border-primary text-k-900" : "border-transparent text-k-300",
    )}
  >
    {children}
  </button>
);

const ApplicantScoreCard = ({ applicant }: { applicant: Applicant }) => (
  <article className="rounded-[10px] bg-white p-4 shadow-[0_0_5px_rgba(0,0,0,0.05)]">
    <h3 className="text-k-900 typo-bold-5">{applicant.nicknameForApply}</h3>
    <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
      <ApplicantMetric label="지망" value={`${applicant.preferenceOrder ?? "-"} 지망`} />
      <ApplicantMetric label="환산점수" value={`${getApplicantConvertedScore(applicant)} 점`} />
      <ApplicantMetric label="학점" value={`${formatApplicantGpa(applicant.gpa)}/4.5 점`} />
      <ApplicantMetric label="어학성적" value={formatApplicantLanguageTest(applicant)} />
    </dl>
  </article>
);

const ApplicantMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-0 items-center justify-between gap-2">
    <dt className="shrink-0 text-k-400 typo-regular-3">{label}</dt>
    <dd className="min-w-0 truncate text-right text-k-900 typo-bold-5">{value}</dd>
  </div>
);

const UniversityLogo = ({ scoreSheet }: { scoreSheet: ScoreSheetType }) => (
  <Image
    src={normalizeImageUrlToUploadCdn(scoreSheet.logoImageUrl)}
    alt="대학 로고"
    width={62}
    height={62}
    className="size-[62px] rounded-full border border-k-50 bg-white object-cover"
    fallbackSrc="/svgs/placeholders/university-logo-placeholder.svg"
  />
);

const ShareActionButton = () => {
  const handleShare = async () => {
    if (!navigator.clipboard?.writeText) {
      showIconToast("logo", "링크 복사를 지원하지 않는 환경이에요.");
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      showIconToast("link", "URL이 복사되었습니다.");
    } catch {
      showIconToast("logo", "URL 복사에 실패했습니다.");
    }
  };

  return (
    <button type="button" onClick={handleShare} className="size-10" aria-label="공유하기">
      <IconShare width={40} height={40} />
    </button>
  );
};

const ApplicationUniversityDetailSkeleton = ({ isDesktop = false }: { isDesktop?: boolean }) => (
  <div className={clsx(isDesktop ? "desktop-page-shell" : "px-5 py-8")}>
    <div className={clsx("animate-pulse bg-k-100", isDesktop ? "h-72 rounded-lg" : "h-60 rounded-3xl")} />
    <div className="mt-6 space-y-3">
      <div className="h-28 animate-pulse rounded-[10px] bg-k-50" />
      <div className="h-28 animate-pulse rounded-[10px] bg-k-50" />
      <div className="h-28 animate-pulse rounded-[10px] bg-k-50" />
    </div>
  </div>
);

const ApplicationUniversityDetailNotFound = ({
  universityName,
  isDesktop,
}: {
  universityName: string;
  isDesktop: boolean;
}) => (
  <div
    className={clsx(
      "flex min-h-[60vh] flex-col items-center justify-center px-5 text-center",
      isDesktop && "desktop-page-shell",
    )}
  >
    <p className="text-k-900 typo-sb-5">{universityName} 지원자 현황을 찾지 못했어요.</p>
    <Link href="/university/application" className="mt-4 rounded-lg bg-primary px-4 py-2 text-k-0 typo-sb-9">
      목록으로 돌아가기
    </Link>
  </div>
);

const findScoreSheetWithApplicants = (
  scoreChoices: ScoreSheetType[][],
  universityName: string,
): ScoreSheetType | null => {
  const matches = scoreChoices.flatMap((choice, choiceIndex) =>
    choice
      .filter((scoreSheet) => scoreSheet.koreanName === universityName)
      .map((scoreSheet) => ({
        preferenceOrder: choiceIndex + 1,
        scoreSheet,
      })),
  );

  if (matches.length === 0) {
    return null;
  }

  const baseScoreSheet = matches[0].scoreSheet;
  const applicantMap = new Map<string, Applicant>();
  const mergedUniversityImages = matches.reduce(
    (images, { scoreSheet }) => ({
      logoImageUrl: images.logoImageUrl ?? scoreSheet.logoImageUrl,
      backgroundImageUrl: images.backgroundImageUrl ?? scoreSheet.backgroundImageUrl,
    }),
    {
      logoImageUrl: baseScoreSheet.logoImageUrl,
      backgroundImageUrl: baseScoreSheet.backgroundImageUrl,
    },
  );

  for (const { preferenceOrder, scoreSheet } of matches) {
    for (const applicant of scoreSheet.applicants) {
      const key = applicant.nicknameForApply;
      if (!applicantMap.has(key)) {
        applicantMap.set(key, {
          ...applicant,
          preferenceOrder: applicant.preferenceOrder ?? preferenceOrder,
        });
      }
    }
  }

  return {
    ...baseScoreSheet,
    ...mergedUniversityImages,
    applicants: Array.from(applicantMap.values()),
  };
};

const getApplicantConvertedScore = (applicant: Applicant) => {
  const score = applicant.convertedScore ?? applicant.score;

  if (typeof score !== "number" || Number.isNaN(score)) {
    return "-";
  }

  return String(score);
};

const getCapacityLabel = (scoreSheet: ScoreSheetType) => {
  if (scoreSheet.studentCapacity === null || scoreSheet.studentCapacity === undefined) {
    return "모집 미정";
  }

  return `모집 ${scoreSheet.studentCapacity}명`;
};

const countryFlagMap: Record<string, string> = {
  미국: "🇺🇸",
  캐나다: "🇨🇦",
  일본: "🇯🇵",
  중국: "🇨🇳",
  대만: "🇹🇼",
  독일: "🇩🇪",
  프랑스: "🇫🇷",
  호주: "🇦🇺",
};

const getCountryLabel = (country: string) => {
  const flag = countryFlagMap[country];
  return flag ? `${flag} ${country}` : country;
};

export default ApplicationUniversityDetailContent;

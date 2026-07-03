"use client";

import { MobileHeroDetailShell } from "@solid-connect/ui";
import clsx from "clsx";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { useGetApplicationsList } from "@/apis/applications";
import Image from "@/components/ui/FallbackImage";
import { showIconToast } from "@/lib/toast/showIconToast";
import { IconShare } from "@/public/svgs";
import type { Applicant, ScoreSheet as ScoreSheetType } from "@/types/application";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
import { formatApplicantGpa, formatApplicantLanguageTest } from "../ScoreSheet";

type ApplicantSort = "preference" | "gpa";

type ApplicationUniversityDetailContentProps = {
  universityName: string;
};

const ApplicationUniversityDetailContent = ({ universityName }: ApplicationUniversityDetailContentProps) => {
  const [sortMode, setSortMode] = useState<ApplicantSort>("preference");
  const { data, isLoading } = useGetApplicationsList();
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

  if (isLoading) {
    return <ApplicationUniversityDetailSkeleton />;
  }

  if (!scoreSheet) {
    return <ApplicationUniversityDetailNotFound universityName={universityName} />;
  }

  return (
    <div className="mx-auto w-full max-w-app bg-white md:min-h-screen">
      <MobileApplicationUniversityDetail
        scoreSheet={scoreSheet}
        applicants={applicants}
        sortMode={sortMode}
        setSortMode={setSortMode}
      />
    </div>
  );
};

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
}: {
  applicants: Applicant[];
  sortMode: ApplicantSort;
  setSortMode: (sortMode: ApplicantSort) => void;
}) => (
  <section className="pt-7">
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
    <div className="mt-4 flex flex-col gap-2">
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

const ApplicationUniversityDetailSkeleton = () => (
  <div className="px-5 py-8">
    <div className="h-60 animate-pulse rounded-3xl bg-k-50" />
    <div className="mt-6 space-y-3">
      <div className="h-28 animate-pulse rounded-[10px] bg-k-50" />
      <div className="h-28 animate-pulse rounded-[10px] bg-k-50" />
      <div className="h-28 animate-pulse rounded-[10px] bg-k-50" />
    </div>
  </div>
);

const ApplicationUniversityDetailNotFound = ({ universityName }: { universityName: string }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
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

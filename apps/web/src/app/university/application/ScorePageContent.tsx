"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useGetApplicationsList } from "@/apis/applications";
import ConfirmCancelModal from "@/components/modal/ConfirmCancelModal";
import { DEFAULT_MAX_CHOICE_COUNT, getHomeUniversityById, REGIONS_KO } from "@/constants/university";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { IconExpandMoreFilled } from "@/public/svgs/community";
import type { Applicant, ScoreSheet as ScoreSheetType } from "@/types/application";
import type { RegionKo } from "@/types/university";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import { DesktopScoreSheet, getApplicationDetailHref, MobileScoreSheet, ScoreSheetLogo } from "./ScoreSheet";

type ApplicantScope = "all" | "withApplicants";
type ScoreSort = "applicants" | "gpa";

type AppliedUniversity = {
  preference: number;
  scoreSheet: ScoreSheetType;
};

type ScorePageViewProps = {
  appliedUniversities: AppliedUniversity[];
  displayedScoreSheets: ScoreSheetType[];
  totalUniversityCount: number;
  applicantUniversityCount: number;
  participantCount: number;
  scope: ApplicantScope;
  regionFilter: RegionKo | "";
  sortMode: ScoreSort;
  onScopeChange: (scope: ApplicantScope) => void;
  onRegionChange: (region: RegionKo | "") => void;
  onSortModeChange: (sortMode: ScoreSort) => void;
  onChangeUniversities: () => void;
};

const ScorePageContent = () => {
  const router = useRouter();
  const isDesktop = useIsDesktopViewport();
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);
  const maxChoiceCount = getHomeUniversityById(homeUniversityId)?.maxChoiceCount ?? DEFAULT_MAX_CHOICE_COUNT;

  const [scope, setScope] = useState<ApplicantScope>("withApplicants");
  const [regionFilter, setRegionFilter] = useState<RegionKo | "">("");
  const [sortMode, setSortMode] = useState<ScoreSort>("applicants");
  const [showNeedApply, _setShowNeedApply] = useState(false);

  const emptyChoices = useMemo(
    () => Array.from({ length: maxChoiceCount }, () => [] as ScoreSheetType[]),
    [maxChoiceCount],
  );
  const { data: scoreResponseData, isError, isLoading } = useGetApplicationsList();
  const scoreChoices = scoreResponseData?.choices ?? emptyChoices;

  const allScoreSheets = useMemo(
    () => sortScoreSheets(uniqueScoreSheets(scoreChoices.flat()), sortMode),
    [scoreChoices, sortMode],
  );
  const appliedUniversities = useMemo(
    () => getAppliedUniversities(scoreChoices, maxChoiceCount),
    [scoreChoices, maxChoiceCount],
  );
  const totalUniversityCount = allScoreSheets.length;
  const applicantUniversityCount = allScoreSheets.filter((scoreSheet) => scoreSheet.applicants.length > 0).length;
  const participantCount = useMemo(() => getParticipantCount(allScoreSheets), [allScoreSheets]);

  const displayedScoreSheets = useMemo(() => {
    let result =
      scope === "withApplicants"
        ? allScoreSheets.filter((scoreSheet) => scoreSheet.applicants.length > 0)
        : allScoreSheets;

    if (regionFilter) {
      result = result.filter((scoreSheet) => scoreSheet.region === regionFilter);
    }

    return sortScoreSheets(result, sortMode);
  }, [allScoreSheets, regionFilter, scope, sortMode]);

  useEffect(() => {
    if (isLoading) return;
    if (isError) {
      router.replace("/university/application/apply");
    }
  }, [isError, isLoading, router]);

  const viewProps = {
    appliedUniversities,
    displayedScoreSheets,
    totalUniversityCount,
    applicantUniversityCount,
    participantCount,
    scope,
    regionFilter,
    sortMode,
    onScopeChange: setScope,
    onRegionChange: setRegionFilter,
    onSortModeChange: setSortMode,
    onChangeUniversities: () => router.push("/university/application/apply"),
  };

  if (isDesktop === null) return null;

  return (
    <>
      {isDesktop ? <ApplicationScoreDesktopView {...viewProps} /> : <ApplicationScoreMobileView {...viewProps} />}
      <ConfirmCancelModal
        title="학교 지원이 필요합니다"
        isOpen={showNeedApply}
        handleCancel={() => router.push("/")}
        handleConfirm={() => router.push("/university/application/apply")}
        content={"점수 공유현황을 확인하려면 지원절차를\n진행해주세요."}
        cancelText="확인"
        approveText="학교 지원하기"
      />
    </>
  );
};

const ApplicationScoreMobileView = ({
  appliedUniversities,
  displayedScoreSheets,
  totalUniversityCount,
  applicantUniversityCount,
  participantCount,
  scope,
  regionFilter,
  sortMode,
  onScopeChange,
  onRegionChange,
  onSortModeChange,
  onChangeUniversities,
}: ScorePageViewProps) => {
  return (
    <main className="mx-auto w-full max-w-app px-5 pb-6">
      <AppliedUniversitySection appliedUniversities={appliedUniversities} onChangeUniversities={onChangeUniversities} />
      <div className="mt-5 h-1 bg-k-50" />
      <ParticipantBanner participantCount={participantCount} />
      <ApplicationScopeTabs
        scope={scope}
        totalUniversityCount={totalUniversityCount}
        applicantUniversityCount={applicantUniversityCount}
        onScopeChange={onScopeChange}
      />
      <ApplicationFilterChips
        regionFilter={regionFilter}
        sortMode={sortMode}
        onRegionChange={onRegionChange}
        onSortModeChange={onSortModeChange}
      />
      <ScoreSheetList scoreSheets={displayedScoreSheets} variant="mobile" />
    </main>
  );
};

const ApplicationScoreDesktopView = ({
  appliedUniversities,
  displayedScoreSheets,
  totalUniversityCount,
  applicantUniversityCount,
  participantCount,
  scope,
  regionFilter,
  sortMode,
  onScopeChange,
  onRegionChange,
  onSortModeChange,
  onChangeUniversities,
}: ScorePageViewProps) => {
  return (
    <main className="desktop-page-shell">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-k-100 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-primary typo-sb-9">Application scores</p>
            <h1 className="mt-2 text-k-900 typo-bold-1">지원자 현황 확인</h1>
            <p className="mt-2 text-k-500 typo-medium-2">
              지원한 학교와 전체 지원자 현황을 한 화면에서 비교할 수 있어요.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <DesktopMetricCard label="전체 대학" value={`${totalUniversityCount}개`} />
            <DesktopMetricCard label="지원자 있는 대학" value={`${applicantUniversityCount}개`} />
            <DesktopMetricCard label="참여자" value={`${participantCount}명`} highlight />
          </div>
        </header>

        <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-lg border border-k-100 bg-white p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-k-900 typo-bold-4">
                  {scope === "withApplicants" ? "지원자 있는 대학" : "모든 대학"}
                </h2>
                <p className="mt-1 text-k-500 typo-medium-3">조건에 맞는 대학 {displayedScoreSheets.length}개</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ScopePill isActive={scope === "withApplicants"} onClick={() => onScopeChange("withApplicants")}>
                  지원자 있음
                </ScopePill>
                <ScopePill isActive={scope === "all"} onClick={() => onScopeChange("all")}>
                  전체 보기
                </ScopePill>
                <ScopePill
                  isActive={sortMode === "gpa"}
                  onClick={() => onSortModeChange(sortMode === "gpa" ? "applicants" : "gpa")}
                >
                  학점 높은 순
                </ScopePill>
              </div>
            </div>

            <ScoreSheetList scoreSheets={displayedScoreSheets} variant="desktop" />
          </section>

          <aside className="desktop-sticky-panel space-y-5">
            <DesktopAppliedUniversityPanel
              appliedUniversities={appliedUniversities}
              onChangeUniversities={onChangeUniversities}
            />
            <DesktopFilterPanel regionFilter={regionFilter} onRegionChange={onRegionChange} />
          </aside>
        </div>
      </div>
    </main>
  );
};

const AppliedUniversitySection = ({
  appliedUniversities,
  onChangeUniversities,
}: {
  appliedUniversities: AppliedUniversity[];
  onChangeUniversities: () => void;
}) => (
  <section className="mt-5">
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-k-900 typo-bold-4">지원한 대학 ({appliedUniversities.length}개)</h1>
      <button
        type="button"
        onClick={onChangeUniversities}
        className="h-8 shrink-0 rounded-2xl bg-primary px-4 text-k-0 typo-sb-12"
      >
        지원 대학교 변경
      </button>
    </div>
    <div className="mt-4 space-y-2">
      {appliedUniversities.length > 0 ? (
        appliedUniversities.map(({ preference, scoreSheet }) => (
          <AppliedUniversityRow
            key={`${preference}-${scoreSheet.koreanName}`}
            preference={preference}
            scoreSheet={scoreSheet}
          />
        ))
      ) : (
        <div className="rounded-lg bg-k-50 px-4 py-4 text-k-500 typo-medium-3">
          지원한 대학 정보를 불러오는 중입니다.
        </div>
      )}
    </div>
  </section>
);

const DesktopAppliedUniversityPanel = ({
  appliedUniversities,
  onChangeUniversities,
}: {
  appliedUniversities: AppliedUniversity[];
  onChangeUniversities: () => void;
}) => (
  <section className="rounded-lg border border-k-100 bg-white p-5">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-k-900 typo-bold-5">지원한 대학</h2>
        <p className="mt-1 text-k-500 typo-medium-3">{appliedUniversities.length}개 대학 선택됨</p>
      </div>
      <button
        type="button"
        onClick={onChangeUniversities}
        className="rounded-full bg-primary px-4 py-2 text-k-0 typo-sb-12"
      >
        변경
      </button>
    </div>
    <div className="mt-4 space-y-2">
      {appliedUniversities.length > 0 ? (
        appliedUniversities.map(({ preference, scoreSheet }) => (
          <AppliedUniversityRow
            key={`${preference}-${scoreSheet.koreanName}`}
            preference={preference}
            scoreSheet={scoreSheet}
          />
        ))
      ) : (
        <div className="rounded-lg bg-k-50 px-4 py-5 text-k-500 typo-medium-3">지원한 대학 정보가 없어요.</div>
      )}
    </div>
  </section>
);

const AppliedUniversityRow = ({ preference, scoreSheet }: AppliedUniversity) => {
  const capacity =
    scoreSheet.studentCapacity === null || scoreSheet.studentCapacity === undefined
      ? "미정"
      : scoreSheet.studentCapacity;

  return (
    <Link
      href={getApplicationDetailHref(scoreSheet.koreanName)}
      className="flex h-11 items-center gap-2.5 rounded-lg border border-k-50 bg-white px-3.5 shadow-[0_0_10px_rgba(0,0,0,0.05)] transition-colors hover:border-secondary-300"
    >
      <ScoreSheetLogo scoreSheet={scoreSheet} className="size-5" />
      <span className="min-w-0 flex-1 truncate text-k-900 typo-sb-7">
        {scoreSheet.koreanName} ({preference}/{capacity})
      </span>
      <span className="flex size-6 shrink-0 items-center justify-center text-k-600" aria-hidden>
        <IconExpandMoreFilled />
      </span>
    </Link>
  );
};

const ParticipantBanner = ({ participantCount }: { participantCount: number }) => (
  <section className="mt-6 rounded-lg bg-secondary-100 px-5 py-3">
    <div className="flex items-center gap-4">
      <div className="flex size-10 items-center justify-center text-[34px]" aria-hidden>
        🔥
      </div>
      <div className="min-w-0 text-k-800">
        <p className="typo-regular-4">솔리드 커넥션과 함께하고 있어요</p>
        <p className="mt-0.5 typo-sb-9">총 {participantCount}명이 성적 공유 참여중!</p>
      </div>
    </div>
  </section>
);

const ApplicationScopeTabs = ({
  scope,
  totalUniversityCount,
  applicantUniversityCount,
  onScopeChange,
}: {
  scope: ApplicantScope;
  totalUniversityCount: number;
  applicantUniversityCount: number;
  onScopeChange: (scope: ApplicantScope) => void;
}) => (
  <div className="mt-6 flex h-11 items-start justify-between">
    <ScopeTabButton isActive={scope === "all"} onClick={() => onScopeChange("all")}>
      모든 대학 ({totalUniversityCount}개)
    </ScopeTabButton>
    <ScopeTabButton isActive={scope === "withApplicants"} onClick={() => onScopeChange("withApplicants")}>
      지원자 있는 대학 ({applicantUniversityCount}개)
    </ScopeTabButton>
  </div>
);

const ScopeTabButton = ({
  children,
  isActive,
  onClick,
}: {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      "flex h-11 flex-1 items-center justify-center border-b-2 typo-medium-2",
      isActive ? "border-primary text-k-900" : "border-transparent text-k-300",
    )}
  >
    {children}
  </button>
);

const ApplicationFilterChips = ({
  regionFilter,
  sortMode,
  onRegionChange,
  onSortModeChange,
}: {
  regionFilter: RegionKo | "";
  sortMode: ScoreSort;
  onRegionChange: (region: RegionKo | "") => void;
  onSortModeChange: (sortMode: ScoreSort) => void;
}) => (
  <div className="mt-4 flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
    {REGIONS_KO.map((region) => (
      <FilterChip
        key={region}
        isActive={regionFilter === region}
        onClick={() => onRegionChange(regionFilter === region ? "" : region)}
      >
        {region}
      </FilterChip>
    ))}
    <FilterChip
      isActive={sortMode === "gpa"}
      onClick={() => onSortModeChange(sortMode === "gpa" ? "applicants" : "gpa")}
    >
      학점 높은 순
    </FilterChip>
  </div>
);

const DesktopFilterPanel = ({
  regionFilter,
  onRegionChange,
}: {
  regionFilter: RegionKo | "";
  onRegionChange: (region: RegionKo | "") => void;
}) => (
  <section className="rounded-lg border border-k-100 bg-white p-5">
    <h2 className="text-k-900 typo-bold-5">지역 필터</h2>
    <p className="mt-1 text-k-500 typo-medium-3">권역별로 지원 현황을 좁혀보세요.</p>
    <div className="mt-4 flex flex-wrap gap-2">
      <FilterChip isActive={regionFilter === ""} onClick={() => onRegionChange("")}>
        전체
      </FilterChip>
      {REGIONS_KO.map((region) => (
        <FilterChip
          key={region}
          isActive={regionFilter === region}
          onClick={() => onRegionChange(regionFilter === region ? "" : region)}
        >
          {region}
        </FilterChip>
      ))}
    </div>
  </section>
);

const FilterChip = ({
  children,
  isActive,
  onClick,
}: {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx("rounded-full px-3 py-[5px] typo-sb-12", isActive ? "bg-primary text-k-0" : "bg-k-50 text-k-300")}
  >
    {children}
  </button>
);

const ScopePill = ({
  children,
  isActive,
  onClick,
}: {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      "rounded-full border px-4 py-2 transition-colors typo-sb-12",
      isActive ? "border-primary bg-primary text-k-0" : "border-k-100 bg-white text-k-500 hover:border-secondary-300",
    )}
  >
    {children}
  </button>
);

const DesktopMetricCard = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div
    className={clsx(
      "min-w-32 rounded-lg border px-4 py-3",
      highlight ? "border-secondary-300 bg-secondary-100" : "border-k-100 bg-white",
    )}
  >
    <p className="text-k-500 typo-medium-12">{label}</p>
    <p className={clsx("mt-1 typo-bold-4", highlight ? "text-primary" : "text-k-900")}>{value}</p>
  </div>
);

const ScoreSheetList = ({ scoreSheets, variant }: { scoreSheets: ScoreSheetType[]; variant: "mobile" | "desktop" }) => {
  if (scoreSheets.length === 0) {
    return <ApplicationScoreEmptyState variant={variant} />;
  }

  if (variant === "desktop") {
    return (
      <div className="mt-6 grid gap-4 2xl:grid-cols-2">
        {scoreSheets.map((scoreSheet, index) => (
          <DesktopScoreSheet key={scoreSheet.koreanName} scoreSheet={scoreSheet} defaultOpen={index === 0} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2 pb-6">
      {scoreSheets.map((scoreSheet, index) => (
        <MobileScoreSheet key={scoreSheet.koreanName} scoreSheet={scoreSheet} defaultOpen={index === 0} />
      ))}
    </div>
  );
};

const ApplicationScoreEmptyState = ({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) => (
  <div
    className={clsx(
      "flex flex-col items-center justify-center rounded-lg bg-k-50 px-6 py-8 text-center",
      variant === "desktop" ? "mt-6 min-h-[360px] border border-k-100" : "mt-4 min-h-48",
    )}
  >
    <p className="text-k-900 typo-sb-7">조건에 맞는 대학이 없어요.</p>
    <p className="mt-2 text-k-500 typo-medium-3">다른 필터로 다시 확인해 주세요.</p>
  </div>
);

const uniqueScoreSheets = (scoreSheets: ScoreSheetType[]) => {
  const scoreSheetMap = new Map<string, ScoreSheetType>();

  for (const scoreSheet of scoreSheets) {
    const key = getScoreSheetKey(scoreSheet);
    const prev = scoreSheetMap.get(key);
    scoreSheetMap.set(
      key,
      prev
        ? {
            ...prev,
            englishName: prev.englishName ?? scoreSheet.englishName,
            logoImageUrl: prev.logoImageUrl ?? scoreSheet.logoImageUrl,
            backgroundImageUrl: prev.backgroundImageUrl ?? scoreSheet.backgroundImageUrl,
            applicants: mergeApplicants(prev.applicants, scoreSheet.applicants),
          }
        : scoreSheet,
    );
  }

  return Array.from(scoreSheetMap.values());
};

const getAppliedUniversities = (scoreChoices: ScoreSheetType[][], maxChoiceCount: number): AppliedUniversity[] => {
  return scoreChoices.slice(0, maxChoiceCount).flatMap((choice, index) => {
    const mine = choice.find((scoreSheet) => scoreSheet.applicants.some((applicant) => applicant.isMine));

    return mine ? [{ preference: index + 1, scoreSheet: mine }] : [];
  });
};

const getScoreSheetKey = (scoreSheet: ScoreSheetType) => {
  return scoreSheet.id ? String(scoreSheet.id) : scoreSheet.koreanName;
};

const mergeApplicants = (currentApplicants: Applicant[], nextApplicants: Applicant[]) => {
  const applicantMap = new Map<string, Applicant>();

  for (const applicant of currentApplicants) {
    applicantMap.set(applicant.nicknameForApply, applicant);
  }

  for (const applicant of nextApplicants) {
    if (!applicantMap.has(applicant.nicknameForApply)) {
      applicantMap.set(applicant.nicknameForApply, applicant);
    }
  }

  return Array.from(applicantMap.values());
};

const getParticipantCount = (scoreSheets: ScoreSheetType[]) => {
  const nicknames = new Set<string>();

  for (const scoreSheet of scoreSheets) {
    for (const applicant of scoreSheet.applicants) {
      nicknames.add(applicant.nicknameForApply);
    }
  }

  return nicknames.size;
};

const getAverageGpa = (scoreSheet: ScoreSheetType) => {
  if (scoreSheet.applicants.length === 0) {
    return 0;
  }

  const totalGpa = scoreSheet.applicants.reduce((sum, applicant) => sum + applicant.gpa, 0);
  return totalGpa / scoreSheet.applicants.length;
};

const sortScoreSheets = (scoreSheets: ScoreSheetType[], sortMode: ScoreSort) => {
  return [...scoreSheets].sort((a, b) => {
    if (sortMode === "gpa") {
      return getAverageGpa(b) - getAverageGpa(a);
    }

    return b.applicants.length - a.applicants.length;
  });
};

export default ScorePageContent;

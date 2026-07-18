"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetMyGpaScore, useGetMyLanguageTestScore } from "@/apis/Scores";
import { getSchoolEmailVerificationPath } from "@/app/my/school-email/_lib/returnTo";
import BlockBtn from "@/components/button/BlockBtn";
import Tab from "@/components/ui/Tab";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { IconSolidConnectionSmallLogo } from "@/public/svgs/my";
import {
  formatLanguageTestScore,
  type GpaScore,
  type LanguageTestScore,
  languageTestMapping,
  ScoreSubmitStatus,
} from "@/types/score";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import { DesktopScoreCard, MobileScoreCard } from "./ScoreCard";

const SCORE_TAB_CHOICES = ["공인어학", "학점"] as const;
type ScoreTab = (typeof SCORE_TAB_CHOICES)[number];
type ScoreViewProps = {
  curTab: ScoreTab;
  setCurTab: (tab: ScoreTab) => void;
  gpaScoreList: GpaScore[];
  homeUniversityName: string;
  languageTestScoreList: LanguageTestScore[];
  isEmptyCurrentTab: boolean;
  onScoreClick: (status: ScoreSubmitStatus, rejectedReason?: string | null) => void;
  onSubmitClick: () => void;
};

const getSubmitLabel = (curTab: ScoreTab) => (curTab === "공인어학" ? "어학 성적 입력하기" : "학점 입력하기");

const ScoreScreen = () => {
  const router = useRouter();
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);
  const isAuthInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [curTab, setCurTab] = useState<ScoreTab>("공인어학");
  const isDesktop = useIsDesktopViewport();
  const shouldFetchGpaScore = isAuthInitialized && isAuthenticated && homeUniversityId !== null;
  // TODO: 서버의 모학교 미인증 에러 코드가 확정되면 GPA 조회 실패 시 학교 인증으로 보내는 fallback을 추가한다.
  const { data: gpaScoreData } = useGetMyGpaScore({ enabled: shouldFetchGpaScore });
  const { data: languageTestScoreList = [] } = useGetMyLanguageTestScore();
  const gpaScoreList = gpaScoreData?.gpaScoreStatusResponseList ?? [];
  const homeUniversityName = gpaScoreData?.homeUniversityName ?? "";
  const isEmptyCurrentTab = curTab === "공인어학" ? languageTestScoreList.length === 0 : gpaScoreList.length === 0;

  useEffect(() => {
    if (!isAuthInitialized || !isAuthenticated || homeUniversityId !== null) {
      return;
    }

    router.replace(getSchoolEmailVerificationPath("score"));
  }, [homeUniversityId, isAuthInitialized, isAuthenticated, router]);

  const handleScoreClick = (status: ScoreSubmitStatus, rejectedReason?: string | null) => {
    if (status === ScoreSubmitStatus.REJECTED) {
      showIconToast("logo", rejectedReason ?? "승인이 거절되었습니다.");
      return;
    }
    if (status === ScoreSubmitStatus.PENDING) {
      showIconToast("cap", "심사중인 성적은 사용할 수 없습니다");
    }
  };

  const handleSubmitClick = () => {
    router.push(curTab === "공인어학" ? "/university/score/submit/language-test" : "/university/score/submit/gpa");
  };

  if (!isAuthInitialized) {
    return null;
  }

  if (isAuthenticated && homeUniversityId === null) {
    return null;
  }

  if (isDesktop === null) return null;

  const viewProps = {
    curTab,
    setCurTab,
    gpaScoreList,
    homeUniversityName,
    languageTestScoreList,
    isEmptyCurrentTab,
    onScoreClick: handleScoreClick,
    onSubmitClick: handleSubmitClick,
  };

  return isDesktop ? <ScoreDesktopView {...viewProps} /> : <ScoreMobileView {...viewProps} />;
};

const ScoreMobileView = ({
  curTab,
  setCurTab,
  gpaScoreList,
  homeUniversityName,
  languageTestScoreList,
  isEmptyCurrentTab,
  onScoreClick,
  onSubmitClick,
}: ScoreViewProps) => {
  return (
    <div className="h-full">
      <div className="mx-5 mb-40">
        <Tab<ScoreTab> choices={SCORE_TAB_CHOICES} choice={curTab} setChoice={setCurTab} />
        {isEmptyCurrentTab ? (
          <MobileScoreEmptyState />
        ) : (
          <MobileScoreList
            curTab={curTab}
            gpaScoreList={gpaScoreList}
            homeUniversityName={homeUniversityName}
            languageTestScoreList={languageTestScoreList}
            onScoreClick={onScoreClick}
          />
        )}
      </div>
      <div className="fixed bottom-14 left-0 right-0 w-full max-w-app bg-white md:bottom-0 md:left-0 md:right-0 md:w-full md:max-w-none">
        <div className="mb-[37px] px-5">
          <BlockBtn onClick={onSubmitClick}>{getSubmitLabel(curTab)}</BlockBtn>
        </div>
      </div>
    </div>
  );
};

const ScoreDesktopView = ({
  curTab,
  setCurTab,
  gpaScoreList,
  homeUniversityName,
  languageTestScoreList,
  isEmptyCurrentTab,
  onScoreClick,
  onSubmitClick,
}: ScoreViewProps) => {
  const currentScoreCount = curTab === "공인어학" ? languageTestScoreList.length : gpaScoreList.length;

  return (
    <div className="desktop-page-shell">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-primary typo-sb-9">My scores</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">성적 확인하기</h1>
          <p className="mt-2 text-k-500 typo-medium-2">
            지원에 사용할 공인어학 성적과 학점 승인 상태를 한 곳에서 확인하세요.
          </p>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
          <section className="min-h-[560px] rounded-lg border border-k-100 bg-white p-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-k-900 typo-bold-4">내 성적</h2>
                <p className="mt-1 text-k-500 typo-medium-3">현재 탭에 등록된 성적 {currentScoreCount}개</p>
              </div>
              <div className="w-72">
                <Tab<ScoreTab> choices={SCORE_TAB_CHOICES} choice={curTab} setChoice={setCurTab} />
              </div>
            </div>

            {isEmptyCurrentTab ? (
              <DesktopScoreEmptyState />
            ) : (
              <DesktopScoreList
                curTab={curTab}
                gpaScoreList={gpaScoreList}
                homeUniversityName={homeUniversityName}
                languageTestScoreList={languageTestScoreList}
                onScoreClick={onScoreClick}
              />
            )}
          </section>

          <aside className="desktop-sticky-panel rounded-lg border border-k-100 bg-white p-6">
            <h2 className="text-k-900 typo-bold-4">성적 등록</h2>
            <p className="mt-2 text-k-500 typo-medium-3">
              새 성적을 제출하면 운영팀 승인 후 지원서에서 사용할 수 있습니다.
            </p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-lg bg-k-50 px-4 py-3 text-k-700 typo-medium-2">
                공인어학과 학점은 각각 제출할 수 있어요.
              </div>
              <div className="rounded-lg bg-k-50 px-4 py-3 text-k-700 typo-medium-2">
                승인 거절 사유는 해당 성적을 누르면 확인할 수 있어요.
              </div>
            </div>
            <button
              type="button"
              onClick={onSubmitClick}
              className="mt-6 w-full rounded-lg bg-primary px-5 py-4 text-white typo-sb-9 transition-colors hover:bg-primary/90"
            >
              {getSubmitLabel(curTab)}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

const ScoreEmptyStateBase = ({ isDesktop }: { isDesktop: boolean }) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center rounded-lg bg-white px-6 py-8 text-center shadow-sdwB",
        isDesktop ? "mt-8 min-h-[320px] justify-center border border-k-100 shadow-none" : "mt-24",
      )}
    >
      <IconSolidConnectionSmallLogo />
      <p className="mt-3 text-k-500 typo-regular-2">
        아직 등록된 성적이 없어요.
        <br />
        아래 버튼을 눌러 성적을 입력해 주세요.
      </p>
    </div>
  );
};

const MobileScoreEmptyState = () => <ScoreEmptyStateBase isDesktop={false} />;

const DesktopScoreEmptyState = () => <ScoreEmptyStateBase isDesktop />;

const ScoreListBase = ({
  curTab,
  gpaScoreList,
  homeUniversityName,
  languageTestScoreList,
  onScoreClick,
  isDesktop,
}: Pick<ScoreViewProps, "curTab" | "gpaScoreList" | "homeUniversityName" | "languageTestScoreList" | "onScoreClick"> & {
  isDesktop: boolean;
}) => {
  const ScoreCard = isDesktop ? DesktopScoreCard : MobileScoreCard;

  return (
    <div className={clsx(isDesktop ? "mt-6 grid gap-4 lg:grid-cols-2" : "mt-3.5 flex flex-col gap-3.5")}>
      {curTab === "공인어학" &&
        languageTestScoreList.map((score) => {
          const submittedDate = score.issueDate;

          return (
            <button
              key={score.id}
              type="button"
              className="text-left"
              onClick={() => onScoreClick(score.verifyStatus, score.rejectedReason)}
            >
              <ScoreCard
                name={languageTestMapping[score.languageTestResponse.languageTestType]}
                score={formatLanguageTestScore(
                  score.languageTestResponse.languageTestType,
                  score.languageTestResponse.languageTestScore,
                )}
                status={score.verifyStatus}
                date={submittedDate}
                dateLabel="제출일"
                isFocused={score.verifyStatus === "APPROVED"}
              />
            </button>
          );
        })}

      {curTab === "학점" &&
        gpaScoreList.map((score) => {
          const submittedDate = score.issueDate;

          return (
            <button
              key={score.id}
              type="button"
              className="text-left"
              onClick={() => onScoreClick(score.verifyStatus, score.rejectedReason)}
            >
              <ScoreCard
                name={homeUniversityName}
                score={`${score.gpaResponse.gpa.toFixed(2)}/${score.gpaResponse.gpaCriteria}`}
                status={score.verifyStatus}
                date={submittedDate}
                dateLabel="제출일"
                isFocused={score.verifyStatus === "APPROVED"}
              />
            </button>
          );
        })}
    </div>
  );
};

const MobileScoreList = (
  props: Pick<
    ScoreViewProps,
    "curTab" | "gpaScoreList" | "homeUniversityName" | "languageTestScoreList" | "onScoreClick"
  >,
) => <ScoreListBase {...props} isDesktop={false} />;

const DesktopScoreList = (
  props: Pick<
    ScoreViewProps,
    "curTab" | "gpaScoreList" | "homeUniversityName" | "languageTestScoreList" | "onScoreClick"
  >,
) => <ScoreListBase {...props} isDesktop />;

export default ScoreScreen;

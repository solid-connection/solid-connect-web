"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetMyGpaScore, useGetMyLanguageTestScore } from "@/apis/Scores";
import { getSchoolEmailVerificationPath } from "@/app/my/school-email/_lib/returnTo";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import useAuthStore from "@/lib/zustand/useAuthStore";
import ApprovedApplicationStatusPage from "./_pages/ApprovedApplicationStatusPage";
import { resolveApplicationStatusAccess } from "./_pages/applicationStatusAccess";
import GuestApplicationStatusPage from "./_pages/GuestApplicationStatusPage";
import ScorePendingApplicationStatusPage from "./_pages/ScorePendingApplicationStatusPage";
import SignedInApplicationStatusPage from "./_pages/SignedInApplicationStatusPage";

const ScorePageContent = () => {
  const router = useRouter();
  const isAuthInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);
  const needsSchoolEmailVerification = isAuthInitialized && isAuthenticated && homeUniversityId === null;
  const shouldFetchScoreStatus = isAuthInitialized && isAuthenticated && homeUniversityId !== null;

  const {
    data: gpaScoreData,
    isLoading: isGpaLoading,
    isError: isGpaError,
    refetch: refetchGpa,
  } = useGetMyGpaScore({ enabled: shouldFetchScoreStatus, refetchOnMount: "always" });
  const {
    data: languageTestScores = [],
    isLoading: isLanguageTestLoading,
    isError: isLanguageTestError,
    refetch: refetchLanguageTest,
  } = useGetMyLanguageTestScore({
    enabled: shouldFetchScoreStatus,
    refetchOnMount: "always",
  });

  useEffect(
    function redirectToSchoolEmailVerification() {
      if (!needsSchoolEmailVerification) return;
      router.replace(getSchoolEmailVerificationPath("applicationStatus"));
    },
    [needsSchoolEmailVerification, router],
  );

  if (
    !isAuthInitialized ||
    needsSchoolEmailVerification ||
    (shouldFetchScoreStatus && (isGpaLoading || isLanguageTestLoading))
  ) {
    return <CloudSpinnerPage />;
  }

  if (shouldFetchScoreStatus && (isGpaError || isLanguageTestError)) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-k-700 typo-medium-2">성적 승인 상태를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => void Promise.all([refetchGpa(), refetchLanguageTest()])}
          className="rounded-full bg-primary px-4 py-2 text-white typo-medium-2"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const access = resolveApplicationStatusAccess({
    isAuthenticated,
    homeUniversityId,
    gpaScores: gpaScoreData?.gpaScoreStatusResponseList ?? [],
    languageTestScores,
  });

  switch (access) {
    case "guest":
      return <GuestApplicationStatusPage />;
    case "signedIn":
      return <SignedInApplicationStatusPage />;
    case "scorePending":
      return <ScorePendingApplicationStatusPage />;
    case "approved":
      return <ApprovedApplicationStatusPage />;
    default: {
      const exhaustiveAccess: never = access;
      return exhaustiveAccess;
    }
  }
};

export default ScorePageContent;

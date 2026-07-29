"use client";

import { useGetMyGpaScore, useGetMyLanguageTestScore } from "@/apis/Scores";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import useAuthStore from "@/lib/zustand/useAuthStore";
import ApprovedApplicationStatusPage from "./_pages/ApprovedApplicationStatusPage";
import { resolveApplicationStatusAccess } from "./_pages/applicationStatusAccess";
import GuestApplicationStatusPage from "./_pages/GuestApplicationStatusPage";
import ScorePendingApplicationStatusPage from "./_pages/ScorePendingApplicationStatusPage";
import SignedInApplicationStatusPage from "./_pages/SignedInApplicationStatusPage";

const ScorePageContent = () => {
  const isAuthInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);
  const shouldFetchScoreStatus = isAuthInitialized && isAuthenticated && homeUniversityId !== null;

  const { data: gpaScoreData, isLoading: isGpaLoading } = useGetMyGpaScore({ enabled: shouldFetchScoreStatus });
  const { data: languageTestScores = [], isLoading: isLanguageTestLoading } = useGetMyLanguageTestScore({
    enabled: shouldFetchScoreStatus,
  });

  if (!isAuthInitialized || (shouldFetchScoreStatus && (isGpaLoading || isLanguageTestLoading))) {
    return <CloudSpinnerPage />;
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
  }
};

export default ScorePageContent;

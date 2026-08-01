import { type GpaScore, type LanguageTestScore, ScoreSubmitStatus } from "@/types/score";

export type ApplicationStatusAccess = "guest" | "signedIn" | "scorePending" | "approved";

type ResolveApplicationStatusAccessParams = {
  isAuthenticated: boolean;
  homeUniversityId: number | null;
  gpaScores: GpaScore[];
  languageTestScores: LanguageTestScore[];
};

export const resolveApplicationStatusAccess = ({
  isAuthenticated,
  homeUniversityId,
  gpaScores,
  languageTestScores,
}: ResolveApplicationStatusAccessParams): ApplicationStatusAccess => {
  if (!isAuthenticated) {
    return "guest";
  }

  if (homeUniversityId === null || gpaScores.length === 0 || languageTestScores.length === 0) {
    return "signedIn";
  }

  const hasApprovedGpa = gpaScores.some((score) => score.verifyStatus === ScoreSubmitStatus.APPROVED);
  const hasApprovedLanguageTest = languageTestScores.some((score) => score.verifyStatus === ScoreSubmitStatus.APPROVED);

  if (!hasApprovedGpa || !hasApprovedLanguageTest) {
    return "scorePending";
  }

  return "approved";
};

export const LANGUAGE_TEST = {
  TOEIC: "toeic",
  TOEFL_IBT: "toefl ibt",
  TOEFL_ITP: "toefl itp",
  IELTS: "ielts",
  JLPT: "jlpt",
  OTHER: "other",
};

export const LANGUAGE_TEST_CONVERSE = {
  toeic: "TOEIC",
  ibt: "TOEFL_IBT",
  itp: "TOEFL_ITP",
  ielts: "IELTS",
  jlpt: "JLPT",
  others: "DUOLINGO",
};

export const SHORT_LANGUAGE_TEST = {
  TOEIC: "TOEIC",
  TOEFL_IBT: "IBT",
  TOEFL_ITP: "ITP",
  IELTS: "IELTS",
  JLPT: "JLPT",
  OTHER: "기타",
};

export const LANGUAGE_TEST_INVERSE = {
  TOEIC: "TOEIC",
  "TOEFL IBT": "TOEFL_IBT",
  "TOEFL ITP": "TOEFL_ITP",
  IELTS: "IELTS",
  JLPT: "JLPT",
};

export type ApplyStatus = "NO_AUTHORIZATION" | "NOT_SUBMITTED" | "SCORE_SUBMITTED" | "COLLEGE_SUBMITTED" | "SUBMITTED_PENDING" | "SUBMITTED_REJECTED" | "SUBMITTED_APPROVED";
export const FORBIDDEN_APPLY_STATUS = ["NOT_SUBMITTED", "SCORE_SUBMITTED", "COLLEGE_SUBMITTED", "SUBMITTED_PENDING", "SUBMITTED_REJECTED"];

// Score
export interface ScoreSheet {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: Applicant[];
}

export interface Applicant {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  mine: boolean;
}

export interface ApplicationScoreRequest {
  languageTestType: "TOEFL_IBT" | "TOEFL_ITP" | "TOEIC" | "IELTS" | "NEW_HSK" | "JLPT" | "DUOLINGO" | "CEFR" | "DELF" | "TCF" | "TEF" | "DALF";
  languageTestScore: string;
  languageTestReportUrl: string;
  gpa: number;
  gpaCriteria: number;
  gpaReportUrl: string;
}

export interface ApplicationUniversityRequest {
  firstChoiceUniversityId: number;
  secondChoiceUniversityId: number;
}

export interface ApplicationListResponse {
  firstChoice: ScoreSheet[];
  secondChoice: ScoreSheet[];
}

export interface ApplicationStatusResponse {
  status: ApplyStatus;
  updateCount: number;
}

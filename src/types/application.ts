export const LANGUAGE_TEST = {
  TOEIC: "toeic",
  TOEFL_IBT: "toefl ibt",
  TOEFL_ITP: "toefl itp",
  IELTS: "ielts",
  JLPT: "jlpt",
  OTHER: "other",
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

export type ApplyStatus = "NO_AUTHORIZATION" | "NOT_SUBMITTED" | "SCORE_SUBMITTED" | "SUBMITTED_PENDING" | "SUBMITTED_REJECTED" | "SUBMITTED_APPROVED";
export type ApplyStatus2 = "NO_AUTHORIZATION" | "NOT_SUBMITTED" | "SCORE_SUBMITTED" | "COLLEGE_SUBMITTED" | "SUBMITTED_PENDING" | "SUBMITTED_REJECTED" | "SUBMITTED_APPROVED";

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

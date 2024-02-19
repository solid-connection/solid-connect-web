export const LANGUAGE_TEST = {
  TOEIC: "toeic",
  TOEFL_IBT: "toefl ibt",
  TOEFL_ITP: "toefl itp",
  IELTS: "ielts",
  JLPT: "jlpt",
  OTHER: "other",
};

export type ApplyStatus = "NO_AUTHORIZATION" | "NOT_SUBMITTED" | "SUBMITTED_PENDING" | "SUBMITTED_REJECTED" | "SUBMITTED_APPROVED";

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

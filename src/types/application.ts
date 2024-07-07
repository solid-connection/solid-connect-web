export type ApplyStatus = "NO_AUTHORIZATION" | "NOT_SUBMITTED" | "SCORE_SUBMITTED" | "COLLEGE_SUBMITTED" | "SUBMITTED_PENDING" | "SUBMITTED_REJECTED" | "SUBMITTED_APPROVED";

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

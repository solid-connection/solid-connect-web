export type ApplyStatus =
  | "NO_AUTHORIZATION"
  | "NOT_SUBMITTED"
  | "SCORE_SUBMITTED"
  | "COLLEGE_SUBMITTED"
  | "SUBMITTED_PENDING"
  | "SUBMITTED_REJECTED"
  | "SUBMITTED_APPROVED";

export interface Applicant {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
  score?: number | null;
  convertedScore?: number | null;
  preferenceOrder?: number | null;
}

export interface ScoreSheet {
  id?: number;
  koreanName: string;
  englishName?: string;
  logoImageUrl?: string | null;
  backgroundImageUrl?: string | null;
  studentCapacity: number | null;
  region: string;
  country: string;
  applicants: Applicant[];
}

export interface ApplicationScoreRequest {
  languageTestType:
    | "TOEFL_IBT"
    | "TOEFL_ITP"
    | "TOEIC"
    | "IELTS"
    | "NEW_HSK"
    | "JLPT"
    | "DUOLINGO"
    | "CEFR"
    | "DELF"
    | "TCF"
    | "TEF"
    | "DALF";
  languageTestScore: string;
  languageTestReportUrl: string;
  gpa: number;
  gpaCriteria: number;
  gpaReportUrl: string;
}

export interface ApplicationUniversityRequest {
  choices: number[];
}

export interface ApplicationListResponse {
  choices: ScoreSheet[][];
}

export interface ApplicationStatusResponse {
  status: ApplyStatus;
  updateCount: number;
}

export interface SubmitApplicationRequest {
  gpaScoreId: number;
  languageTestScoreId: number;
  universityChoiceRequest: {
    choices: number[];
  };
}

export interface SubmitApplicationResponse {
  isSuccess: boolean;
}

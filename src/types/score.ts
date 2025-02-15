export interface SubmitGpaScoreRequest {
  gpa: number;
  gpaCriteria: number;
  issueDate: string; // yyyy-MM-dd
  file: Blob;
}

export interface SubmitLanguageTestScoreRequest {
  languageTestType: string;
  languageTestScore: string;
  issueDate: string; // yyyy-MM-dd
  file: Blob;
}

export interface GpaScore {
  id: number;
  gpa: {
    gpa: number;
    gpaCriteria: number;
    gpaReportUrl: string;
  };
  issueDate: string; // yyyy-MM-dd
  verifyStatus: ScoreSubmitStatus;
  rejectedReason: string | null;
}

export interface MyGpaScoreResponse {
  gpaScoreStatusList: GpaScore[];
}

export interface LanguageTestScore {
  id: number;
  languageTest: {
    languageTestType: string;
    languageTestScore: string;
    languageTestReportUrl: string;
  };
  issueDate: string; // yyyy-MM-dd
  verifyStatus: ScoreSubmitStatus;
  rejectedReason: string | null;
}

export interface MyLanguageTestScoreResponse {
  languageTestScoreStatusList: LanguageTestScore[];
}

export type ScoreSubmitStatus = "PENDING" | "REJECTED" | "APPROVED";

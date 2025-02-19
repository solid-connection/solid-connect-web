export enum LanguageTestEnum {
  TOEIC = "TOEIC",
  TOEFL_IBT = "TOEFL_IBT",
  TOEFL_ITP = "TOEFL_ITP",
  IELTS = "IELTS",
  JLPT = "JLPT",
  NEW_HSK = "NEW_HSK",

  DALF = "DALF",
  CEFR = "CEFR",
  TCF = "TCF",
  TEF = "TEF",
  DUOLINGO = "DUOLINGO",
}

export interface SubmitGpaScoreRequest {
  gpaScoreRequest: {
    gpa: number;
    gpaCriteria: number;
    issueDate: string; // yyyy-MM-dd
  };
  file: Blob;
}

export interface SubmitLanguageTestScoreRequest {
  languageTestScoreRequest: {
    languageTestType: LanguageTestEnum;
    languageTestScore: string;
    issueDate: string; // yyyy-MM-dd
  };
  file: File;
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

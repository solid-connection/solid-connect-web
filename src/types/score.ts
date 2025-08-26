export enum LanguageTestEnum {
  TOEIC = "TOEIC",
  TOEFL_IBT = "TOEFL_IBT",
  TOEFL_ITP = "TOEFL_ITP",
  IELTS = "IELTS",
  JLPT = "JLPT",
  NEW_HSK = "NEW_HSK",
  ETC = "ETC",

  DALF = "DALF",
  CEFR = "CEFR",
  TCF = "TCF",
  TEF = "TEF",
  DUOLINGO = "DUOLINGO",
}

export const languageTestMapping: Record<LanguageTestEnum, string> = {
  TOEIC: "TOEIC",
  TOEFL_IBT: "TOEFL IBT",
  TOEFL_ITP: "TOEFL ITP",
  IELTS: "IELTS",
  JLPT: "JLPT",
  NEW_HSK: "NEW HSK",
  ETC: "기타",
  DALF: "DALF",
  CEFR: "CEFR",
  TCF: "TCF",
  TEF: "TEF",
  DUOLINGO: "DUOLINGO",
};

// --- 시험 정보 통합 매핑 객체 ---
export const languageTestScoreInfo: Record<LanguageTestEnum, LanguageTestInfo> = {
  // --- 점수 기반 시험 ---
  [LanguageTestEnum.TOEIC]: { label: "TOEIC", min: 10, max: 990 },
  [LanguageTestEnum.TOEFL_IBT]: { label: "TOEFL iBT", min: 0, max: 120 },
  [LanguageTestEnum.TOEFL_ITP]: { label: "TOEFL ITP", min: 310, max: 677 },
  [LanguageTestEnum.IELTS]: { label: "IELTS", min: 0.0, max: 9.0 },
  [LanguageTestEnum.DUOLINGO]: { label: "DUOLINGO", min: 10, max: 160 },
  [LanguageTestEnum.TCF]: { label: "TCF", min: 100, max: 699 },
  [LanguageTestEnum.TEF]: { label: "TEF", min: 0, max: 900 },
  [LanguageTestEnum.NEW_HSK]: { label: "NEW HSK", min: 1, max: 9 },

  // --- 레벨 기반 시험 ---
  [LanguageTestEnum.JLPT]: { label: "JLPT", min: "N5", max: "N1" },
  [LanguageTestEnum.DALF]: { label: "DALF", min: "C1", max: "C2" },
  [LanguageTestEnum.CEFR]: { label: "CEFR", min: "A1", max: "C2" },

  // --- 기타 ---
  [LanguageTestEnum.ETC]: { label: "기타", min: "기타", max: "기타" },
};

export const languageTestShortMapping: Record<LanguageTestEnum, string> = {
  TOEIC: "TOEIC",
  TOEFL_IBT: "IBT",
  TOEFL_ITP: "ITP",
  IELTS: "IELTS",
  JLPT: "JLPT",
  NEW_HSK: "HSK",
  ETC: "기타",
  DALF: "DALF",
  CEFR: "CEFR",
  TCF: "TCF",
  TEF: "TEF",
  DUOLINGO: "DUOLINGO",
};

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
  gpaResponse: {
    gpa: number;
    gpaCriteria: number;
    gpaReportUrl: string;
  };
  issueDate: string; // yyyy-MM-dd
  verifyStatus: ScoreSubmitStatus;
  rejectedReason: string | null;
}

export interface MyGpaScoreResponse {
  gpaScoreStatusResponseList: GpaScore[];
}

export interface LanguageTestScore {
  id: number;
  languageTestResponse: {
    languageTestType: LanguageTestEnum;
    languageTestScore: string;
    languageTestReportUrl: string;
  };
  issueDate: string; // yyyy-MM-dd
  verifyStatus: ScoreSubmitStatus;
  rejectedReason: string | null;
}

export interface MyLanguageTestScoreResponse {
  languageTestScoreStatusResponseList: LanguageTestScore[];
}

export enum ScoreSubmitStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

type LanguageTestInfo = {
  label: string;
  min: number | string;
  max: number | string;
};

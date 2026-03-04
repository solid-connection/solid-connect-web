export interface AdminSignInResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ReissueAccessTokenResponse {
  accessToken: string;
}

export type VerifyStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ScoreSearchCondition {
  verifyStatus?: VerifyStatus;
}

export interface GpaResponse {
  gpa: number;
  gpaCriteria: number;
  gpaReportUrl: string;
}

export interface GpaScoreStatusResponse {
  id: number;
  gpaResponse: GpaResponse;
  verifyStatus: VerifyStatus;
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface GpaScoreWithUser {
  gpaScoreStatusResponse: GpaScoreStatusResponse;
  siteUserResponse: SiteUserResponse;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface LanguageTestResponse {
  languageTestType: string;
  languageTestScore: string;
  languageTestReportUrl: string;
}

export interface LanguageTestScoreStatusResponse {
  id: number;
  languageTestResponse: LanguageTestResponse;
  verifyStatus: VerifyStatus;
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LanguageScoreWithUser {
  languageTestScoreStatusResponse: LanguageTestScoreStatusResponse;
  siteUserResponse: SiteUserResponse;
}

export type LanguageTestType =
  | "TOEIC"
  | "TOEFL_IBT"
  | "TOEFL_ITP"
  | "IELTS"
  | "JLPT"
  | "NEW_HSK"
  | "ETC"
  | "DALF"
  | "CEFR"
  | "TCF"
  | "TEF"
  | "DUOLINGO";

export interface GpaScoreUpdateRequest {
  gpa: number;
  gpaCriteria: number;
  verifyStatus: VerifyStatus;
  rejectedReason?: string;
}

export interface LanguageTestScoreUpdateRequest {
  languageTestType: LanguageTestType;
  languageTestScore: string;
  verifyStatus: VerifyStatus;
  rejectedReason?: string;
}

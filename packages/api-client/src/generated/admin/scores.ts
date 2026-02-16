import { axiosInstance } from "../../runtime";
import type {
  GpaScoreUpdateRequest,
  GpaScoreWithUser,
  LanguageScoreWithUser,
  LanguageTestScoreUpdateRequest,
  LanguageTestType,
  PageResponse,
  ScoreSearchCondition,
  VerifyStatus,
} from "./types";

export const scoreApi = {
  getGpaScores: (condition: ScoreSearchCondition, page: number): Promise<PageResponse<GpaScoreWithUser>> =>
    axiosInstance.get("/admin/scores/gpas", { params: { ...condition, page } }).then((res) => res.data),

  updateGpaScore: (id: number, status: VerifyStatus, reason?: string, score?: GpaScoreWithUser) => {
    if (!score) throw new Error("Score data is required");
    const request: GpaScoreUpdateRequest = {
      gpa: score.gpaScoreStatusResponse.gpaResponse.gpa,
      gpaCriteria: score.gpaScoreStatusResponse.gpaResponse.gpaCriteria,
      verifyStatus: status,
      rejectedReason: reason,
    };
    return axiosInstance.put(`/admin/scores/gpas/${id}`, request);
  },

  getLanguageScores: (condition: ScoreSearchCondition, page: number): Promise<PageResponse<LanguageScoreWithUser>> =>
    axiosInstance.get("/admin/scores/language-tests", { params: { ...condition, page } }).then((res) => res.data),

  updateLanguageScore: (id: number, status: VerifyStatus, reason?: string, score?: LanguageScoreWithUser) => {
    if (!score) throw new Error("Score data is required");
    const request: LanguageTestScoreUpdateRequest = {
      languageTestType: score.languageTestScoreStatusResponse.languageTestResponse.languageTestType as LanguageTestType,
      languageTestScore: score.languageTestScoreStatusResponse.languageTestResponse.languageTestScore,
      verifyStatus: status,
      rejectedReason: reason,
    };
    return axiosInstance.put(`/admin/scores/language-tests/${id}`, request);
  },
};

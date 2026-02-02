import { axiosInstance } from "@/utils/axiosInstance";

export interface CreateLanguageTestResponse {
  id: number;
}

export type CreateLanguageTestRequest = Record<string, never>;

export interface LanguageTestListResponseLanguageTestScoreStatusResponseListItem {
  id: number;
  languageTestResponse: LanguageTestListResponseLanguageTestScoreStatusResponseListItemLanguageTestResponse;
  verifyStatus: string;
  rejectedReason: null;
}

export interface LanguageTestListResponseLanguageTestScoreStatusResponseListItemLanguageTestResponse {
  languageTestType: string;
  languageTestScore: string;
  languageTestReportUrl: string;
}

export interface LanguageTestListResponse {
  languageTestScoreStatusResponseList: LanguageTestListResponseLanguageTestScoreStatusResponseListItem[];
}

export interface CreateGpaResponse {
  id: number;
}

export type CreateGpaRequest = Record<string, never>;

export interface GpaListResponseGpaScoreStatusResponseListItem {
  id: number;
  gpaResponse: GpaListResponseGpaScoreStatusResponseListItemGpaResponse;
  verifyStatus: string;
  rejectedReason: null;
}

export interface GpaListResponseGpaScoreStatusResponseListItemGpaResponse {
  gpa: number;
  gpaCriteria: number;
  gpaReportUrl: string;
}

export interface GpaListResponse {
  gpaScoreStatusResponseList: GpaListResponseGpaScoreStatusResponseListItem[];
}

export const scoresApi = {
  postCreateLanguageTest: async (params: { data?: CreateLanguageTestRequest }): Promise<CreateLanguageTestResponse> => {
    const res = await axiosInstance.post<CreateLanguageTestResponse>(
      `/scores/language-tests`, params?.data
    );
    return res.data;
  },

  getLanguageTestList: async (params: { params?: Record<string, unknown> }): Promise<LanguageTestListResponse> => {
    const res = await axiosInstance.get<LanguageTestListResponse>(
      `/scores/language-tests`, { params: params?.params }
    );
    return res.data;
  },

  postCreateGpa: async (params: { data?: CreateGpaRequest }): Promise<CreateGpaResponse> => {
    const res = await axiosInstance.post<CreateGpaResponse>(
      `/scores/gpas`, params?.data
    );
    return res.data;
  },

  getGpaList: async (params: { params?: Record<string, unknown> }): Promise<GpaListResponse> => {
    const res = await axiosInstance.get<GpaListResponse>(
      `/scores/gpas`, { params: params?.params }
    );
    return res.data;
  },

};
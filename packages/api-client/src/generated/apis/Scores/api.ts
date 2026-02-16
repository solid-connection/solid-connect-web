import { axiosInstance } from "../../../runtime/axiosInstance";

export interface PostCreateLanguageTestResponse {
  id: number;
}

export type PostCreateLanguageTestRequest = Record<string, never>;

export interface GetLanguageTestListResponseLanguageTestScoreStatusResponseListItem {
  id: number;
  languageTestResponse: GetLanguageTestListResponseLanguageTestScoreStatusResponseListItemLanguageTestResponse;
  verifyStatus: string;
  rejectedReason: null;
}

export interface GetLanguageTestListResponseLanguageTestScoreStatusResponseListItemLanguageTestResponse {
  languageTestType: string;
  languageTestScore: string;
  languageTestReportUrl: string;
}

export interface GetLanguageTestListResponse {
  languageTestScoreStatusResponseList: GetLanguageTestListResponseLanguageTestScoreStatusResponseListItem[];
}

export interface PostCreateGpaResponse {
  id: number;
}

export type PostCreateGpaRequest = Record<string, never>;

export interface GetGpaListResponseGpaScoreStatusResponseListItem {
  id: number;
  gpaResponse: GetGpaListResponseGpaScoreStatusResponseListItemGpaResponse;
  verifyStatus: string;
  rejectedReason: null;
}

export interface GetGpaListResponseGpaScoreStatusResponseListItemGpaResponse {
  gpa: number;
  gpaCriteria: number;
  gpaReportUrl: string;
}

export interface GetGpaListResponse {
  gpaScoreStatusResponseList: GetGpaListResponseGpaScoreStatusResponseListItem[];
}

export const scoresApi = {
  postCreateLanguageTest: async (params: { data?: PostCreateLanguageTestRequest }): Promise<PostCreateLanguageTestResponse> => {
    const res = await axiosInstance.post<PostCreateLanguageTestResponse>(
      `/scores/language-tests`, params?.data
    );
    return res.data;
  },

  getLanguageTestList: async (params: { params?: Record<string, unknown> }): Promise<GetLanguageTestListResponse> => {
    const res = await axiosInstance.get<GetLanguageTestListResponse>(
      `/scores/language-tests`, { params: params?.params }
    );
    return res.data;
  },

  postCreateGpa: async (params: { data?: PostCreateGpaRequest }): Promise<PostCreateGpaResponse> => {
    const res = await axiosInstance.post<PostCreateGpaResponse>(
      `/scores/gpas`, params?.data
    );
    return res.data;
  },

  getGpaList: async (params: { params?: Record<string, unknown> }): Promise<GetGpaListResponse> => {
    const res = await axiosInstance.get<GetGpaListResponse>(
      `/scores/gpas`, { params: params?.params }
    );
    return res.data;
  },

};
import { axiosInstance } from "@/utils/axiosInstance";

export interface VerifyLanguageTestResponse {
  id: number;
  languageTestType: string;
  languageTestScore: string;
  verifyStatus: string;
  rejectedReason: null;
}

export type VerifyLanguageTestRequest = Record<string, never>;

export interface LanguageTestListResponseSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface LanguageTestListResponsePageable {
  pageNumber: number;
  pageSize: number;
  sort: LanguageTestListResponsePageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface LanguageTestListResponsePageableSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface LanguageTestListResponseContentItem {
  languageTestScoreStatusResponse: LanguageTestListResponseContentItemLanguageTestScoreStatusResponse;
  siteUserResponse: LanguageTestListResponseContentItemSiteUserResponse;
}

export interface LanguageTestListResponseContentItemSiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface LanguageTestListResponseContentItemLanguageTestScoreStatusResponse {
  id: number;
  languageTestResponse: LanguageTestListResponseContentItemLanguageTestScoreStatusResponseLanguageTestResponse;
  verifyStatus: string;
  rejectedReason: null;
  createdAt: string;
  updatedAt: string;
}

export interface LanguageTestListResponseContentItemLanguageTestScoreStatusResponseLanguageTestResponse {
  languageTestType: string;
  languageTestScore: string;
  languageTestReportUrl: string;
}

export interface LanguageTestListResponse {
  content: LanguageTestListResponseContentItem[];
  pageable: LanguageTestListResponsePageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: LanguageTestListResponseSort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface VerifyGpaResponse {
  id: number;
  gpa: number;
  gpaCriteria: number;
  verifyStatus: string;
  rejectedReason: null;
}

export type VerifyGpaRequest = Record<string, never>;

export interface GpaListResponseSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface GpaListResponsePageable {
  pageNumber: number;
  pageSize: number;
  sort: GpaListResponsePageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface GpaListResponsePageableSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface GpaListResponseContentItem {
  gpaScoreStatusResponse: GpaListResponseContentItemGpaScoreStatusResponse;
  siteUserResponse: GpaListResponseContentItemSiteUserResponse;
}

export interface GpaListResponseContentItemSiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface GpaListResponseContentItemGpaScoreStatusResponse {
  id: number;
  gpaResponse: GpaListResponseContentItemGpaScoreStatusResponseGpaResponse;
  verifyStatus: string;
  rejectedReason: null;
  createdAt: string;
  updatedAt: string;
}

export interface GpaListResponseContentItemGpaScoreStatusResponseGpaResponse {
  gpa: number;
  gpaCriteria: number;
  gpaReportUrl: string;
}

export interface GpaListResponse {
  content: GpaListResponseContentItem[];
  pageable: GpaListResponsePageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: GpaListResponseSort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export const adminApi = {
  putVerifyLanguageTest: async (params: {
    languageTestScoreId: string | number;
    data?: VerifyLanguageTestRequest;
  }): Promise<VerifyLanguageTestResponse> => {
    const res = await axiosInstance.put<VerifyLanguageTestResponse>(
      `/admin/scores/language-tests/${params.languageTestScoreId}`,
      params?.data,
    );
    return res.data;
  },

  getLanguageTestList: async (params: { params?: Record<string, unknown> }): Promise<LanguageTestListResponse> => {
    const res = await axiosInstance.get<LanguageTestListResponse>(`/admin/scores/language-tests?page=1&size=10`, {
      params: params?.params,
    });
    return res.data;
  },

  putVerifyGpa: async (params: {
    gpaScoreId: string | number;
    data?: VerifyGpaRequest;
  }): Promise<VerifyGpaResponse> => {
    const res = await axiosInstance.put<VerifyGpaResponse>(`/admin/scores/gpas/${params.gpaScoreId}`, params?.data);
    return res.data;
  },

  getGpaList: async (params: { params?: Record<string, unknown> }): Promise<GpaListResponse> => {
    const res = await axiosInstance.get<GpaListResponse>(`/admin/scores/gpas`, { params: params?.params });
    return res.data;
  },
};

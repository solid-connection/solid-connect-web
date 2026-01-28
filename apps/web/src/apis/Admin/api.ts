import { axiosInstance } from "@/utils/axiosInstance";

export type RejectMentorApplicationResponse = void;

export type RejectMentorApplicationRequest = Record<string, never>;

export type MentorApplicationListResponse = void;

export type ApproveMentorApplicationResponse = void;

export type ApproveMentorApplicationRequest = Record<string, never>;

export type MappingMentorapplicationUniversityResponse = void;

export type MappingMentorapplicationUniversityRequest = Record<string, never>;

export type CountMentorApplicationByStatusResponse = void;

export type MentorApplicationHistoryListResponse = void;

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
  postRejectMentorApplication: async (params: { mentorApplicationId: string | number, data?: RejectMentorApplicationRequest }): Promise<RejectMentorApplicationResponse> => {
    const res = await axiosInstance.post<RejectMentorApplicationResponse>(
      `/admin/mentor-applications/${params.mentorApplicationId}/reject`, params?.data
    );
    return res.data;
  },

  getMentorApplicationList: async (params: { params?: Record<string, any> }): Promise<MentorApplicationListResponse> => {
    const res = await axiosInstance.get<MentorApplicationListResponse>(
      `/admin/mentor-applications?page=2&size=10&mentorApplicationStatus=PENDING&nickname&createdAt=2025-11-14`, { params: params?.params }
    );
    return res.data;
  },

  postApproveMentorApplication: async (params: { mentorApplicationId: string | number, data?: ApproveMentorApplicationRequest }): Promise<ApproveMentorApplicationResponse> => {
    const res = await axiosInstance.post<ApproveMentorApplicationResponse>(
      `/admin/mentor-applications/${params.mentorApplicationId}/approve`, params?.data
    );
    return res.data;
  },

  postMappingMentorapplicationUniversity: async (params: { mentorApplicationId: string | number, data?: MappingMentorapplicationUniversityRequest }): Promise<MappingMentorapplicationUniversityResponse> => {
    const res = await axiosInstance.post<MappingMentorapplicationUniversityResponse>(
      `/admin/mentor-applications/${params.mentorApplicationId}/assign-university`, params?.data
    );
    return res.data;
  },

  getCountMentorApplicationByStatus: async (params: { params?: Record<string, any> }): Promise<CountMentorApplicationByStatusResponse> => {
    const res = await axiosInstance.get<CountMentorApplicationByStatusResponse>(
      `/admin/mentor-applications/count`, { params: params?.params }
    );
    return res.data;
  },

  getMentorApplicationHistoryList: async (params: { site_user_id: string | number, params?: Record<string, any> }): Promise<MentorApplicationHistoryListResponse> => {
    const res = await axiosInstance.get<MentorApplicationHistoryListResponse>(
      `/admin/mentor-applications/${params.site_user_id}/history`, { params: params?.params }
    );
    return res.data;
  },

  putVerifyLanguageTest: async (params: { languageTestScoreId: string | number, data?: VerifyLanguageTestRequest }): Promise<VerifyLanguageTestResponse> => {
    const res = await axiosInstance.put<VerifyLanguageTestResponse>(
      `/admin/scores/language-tests/${params.languageTestScoreId}`, params?.data
    );
    return res.data;
  },

  getLanguageTestList: async (params: { params?: Record<string, any> }): Promise<LanguageTestListResponse> => {
    const res = await axiosInstance.get<LanguageTestListResponse>(
      `/admin/scores/language-tests?page=1&size=10`, { params: params?.params }
    );
    return res.data;
  },

  putVerifyGpa: async (params: { gpaScoreId: string | number, data?: VerifyGpaRequest }): Promise<VerifyGpaResponse> => {
    const res = await axiosInstance.put<VerifyGpaResponse>(
      `/admin/scores/gpas/${params.gpaScoreId}`, params?.data
    );
    return res.data;
  },

  getGpaList: async (params: { params?: Record<string, any> }): Promise<GpaListResponse> => {
    const res = await axiosInstance.get<GpaListResponse>(
      `/admin/scores/gpas`, { params: params?.params }
    );
    return res.data;
  },

};
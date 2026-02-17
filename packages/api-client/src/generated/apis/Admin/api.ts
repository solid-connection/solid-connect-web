import { axiosInstance } from "../../../runtime/axiosInstance";

export type DeleteAdminRegionsCodeResponse = void;

export interface PostAdminRegionsResponse {
  code: string;
  koreanName: string;
}

export type PostAdminRegionsRequest = Record<string, never>;

export interface PutAdminRegionsCodeResponse {
  code: string;
  koreanName: string;
}

export type PutAdminRegionsCodeRequest = Record<string, never>;

export interface GetAdminRegionsResponseItem {
  code: string;
  koreanName: string;
}

export type GetAdminRegionsResponse = GetAdminRegionsResponseItem[];

export type PostRejectMentorApplicationResponse = void;

export type PostRejectMentorApplicationRequest = Record<string, never>;

export type GetMentorApplicationListResponse = void;

export type PostApproveMentorApplicationResponse = void;

export type PostApproveMentorApplicationRequest = Record<string, never>;

export type PostMappingMentorapplicationUniversityResponse = void;

export type PostMappingMentorapplicationUniversityRequest = Record<string, never>;

export type GetCountMentorApplicationByStatusResponse = void;

export type GetMentorApplicationHistoryListResponse = void;

export interface PutVerifyLanguageTestResponse {
  id: number;
  languageTestType: string;
  languageTestScore: string;
  verifyStatus: string;
  rejectedReason: null;
}

export type PutVerifyLanguageTestRequest = Record<string, never>;

export interface GetLanguageTestListResponseSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface GetLanguageTestListResponsePageable {
  pageNumber: number;
  pageSize: number;
  sort: GetLanguageTestListResponsePageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface GetLanguageTestListResponsePageableSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface GetLanguageTestListResponseContentItem {
  languageTestScoreStatusResponse: GetLanguageTestListResponseContentItemLanguageTestScoreStatusResponse;
  siteUserResponse: GetLanguageTestListResponseContentItemSiteUserResponse;
}

export interface GetLanguageTestListResponseContentItemSiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface GetLanguageTestListResponseContentItemLanguageTestScoreStatusResponse {
  id: number;
  languageTestResponse: GetLanguageTestListResponseContentItemLanguageTestScoreStatusResponseLanguageTestResponse;
  verifyStatus: string;
  rejectedReason: null;
  createdAt: string;
  updatedAt: string;
}

export interface GetLanguageTestListResponseContentItemLanguageTestScoreStatusResponseLanguageTestResponse {
  languageTestType: string;
  languageTestScore: string;
  languageTestReportUrl: string;
}

export interface GetLanguageTestListResponse {
  content: GetLanguageTestListResponseContentItem[];
  pageable: GetLanguageTestListResponsePageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: GetLanguageTestListResponseSort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export type DeleteAdminCountriesCodeResponse = void;

export interface PostAdminCountriesResponse {
  code: string;
  koreanName: string;
  regionCode: string;
}

export type PostAdminCountriesRequest = Record<string, never>;

export interface PutAdminCountriesCodeResponse {
  code: string;
  koreanName: string;
  regionCode: string;
}

export type PutAdminCountriesCodeRequest = Record<string, never>;

export interface GetAdminCountriesResponseItem {
  code: string;
  koreanName: string;
  regionCode: string;
}

export type GetAdminCountriesResponse = GetAdminCountriesResponseItem[];

export interface PutVerifyGpaResponse {
  id: number;
  gpa: number;
  gpaCriteria: number;
  verifyStatus: string;
  rejectedReason: null;
}

export type PutVerifyGpaRequest = Record<string, never>;

export interface GetGpaListResponseSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface GetGpaListResponsePageable {
  pageNumber: number;
  pageSize: number;
  sort: GetGpaListResponsePageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface GetGpaListResponsePageableSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface GetGpaListResponseContentItem {
  gpaScoreStatusResponse: GetGpaListResponseContentItemGpaScoreStatusResponse;
  siteUserResponse: GetGpaListResponseContentItemSiteUserResponse;
}

export interface GetGpaListResponseContentItemSiteUserResponse {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface GetGpaListResponseContentItemGpaScoreStatusResponse {
  id: number;
  gpaResponse: GetGpaListResponseContentItemGpaScoreStatusResponseGpaResponse;
  verifyStatus: string;
  rejectedReason: null;
  createdAt: string;
  updatedAt: string;
}

export interface GetGpaListResponseContentItemGpaScoreStatusResponseGpaResponse {
  gpa: number;
  gpaCriteria: number;
  gpaReportUrl: string;
}

export interface GetGpaListResponse {
  content: GetGpaListResponseContentItem[];
  pageable: GetGpaListResponsePageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: GetGpaListResponseSort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export const adminApi = {
  deleteAdminRegionsCode: async (params: { code: string | number }): Promise<DeleteAdminRegionsCodeResponse> => {
    const res = await axiosInstance.delete<DeleteAdminRegionsCodeResponse>(
      `/admin/regions/${params.code}`
    );
    return res.data;
  },

  postAdminRegions: async (params: { data?: PostAdminRegionsRequest }): Promise<PostAdminRegionsResponse> => {
    const res = await axiosInstance.post<PostAdminRegionsResponse>(
      `/admin/regions`, params?.data
    );
    return res.data;
  },

  putAdminRegionsCode: async (params: { code: string | number, data?: PutAdminRegionsCodeRequest }): Promise<PutAdminRegionsCodeResponse> => {
    const res = await axiosInstance.put<PutAdminRegionsCodeResponse>(
      `/admin/regions/${params.code}`, params?.data
    );
    return res.data;
  },

  getAdminRegions: async (params: { params?: Record<string, unknown> }): Promise<GetAdminRegionsResponse> => {
    const res = await axiosInstance.get<GetAdminRegionsResponse>(
      `/admin/regions`, { params: params?.params }
    );
    return res.data;
  },

  postRejectMentorApplication: async (params: { mentorApplicationId: string | number, data?: PostRejectMentorApplicationRequest }): Promise<PostRejectMentorApplicationResponse> => {
    const res = await axiosInstance.post<PostRejectMentorApplicationResponse>(
      `/admin/mentor-applications/${params.mentorApplicationId}/reject`, params?.data
    );
    return res.data;
  },

  getMentorApplicationList: async (params: { params?: Record<string, unknown> }): Promise<GetMentorApplicationListResponse> => {
    const res = await axiosInstance.get<GetMentorApplicationListResponse>(
      `/admin/mentor-applications`, { params: params?.params }
    );
    return res.data;
  },

  postApproveMentorApplication: async (params: { mentorApplicationId: string | number, data?: PostApproveMentorApplicationRequest }): Promise<PostApproveMentorApplicationResponse> => {
    const res = await axiosInstance.post<PostApproveMentorApplicationResponse>(
      `/admin/mentor-applications/${params.mentorApplicationId}/approve`, params?.data
    );
    return res.data;
  },

  postMappingMentorapplicationUniversity: async (params: { mentorApplicationId: string | number, data?: PostMappingMentorapplicationUniversityRequest }): Promise<PostMappingMentorapplicationUniversityResponse> => {
    const res = await axiosInstance.post<PostMappingMentorapplicationUniversityResponse>(
      `/admin/mentor-applications/${params.mentorApplicationId}/assign-university`, params?.data
    );
    return res.data;
  },

  getCountMentorApplicationByStatus: async (params: { params?: Record<string, unknown> }): Promise<GetCountMentorApplicationByStatusResponse> => {
    const res = await axiosInstance.get<GetCountMentorApplicationByStatusResponse>(
      `/admin/mentor-applications/count`, { params: params?.params }
    );
    return res.data;
  },

  getMentorApplicationHistoryList: async (params: { site_user_id: string | number, params?: Record<string, unknown> }): Promise<GetMentorApplicationHistoryListResponse> => {
    const res = await axiosInstance.get<GetMentorApplicationHistoryListResponse>(
      `/admin/mentor-applications/${params.site_user_id}/history`, { params: params?.params }
    );
    return res.data;
  },

  putVerifyLanguageTest: async (params: { languageTestScoreId: string | number, data?: PutVerifyLanguageTestRequest }): Promise<PutVerifyLanguageTestResponse> => {
    const res = await axiosInstance.put<PutVerifyLanguageTestResponse>(
      `/admin/scores/language-tests/${params.languageTestScoreId}`, params?.data
    );
    return res.data;
  },

  getLanguageTestList: async (params: { params?: Record<string, unknown> }): Promise<GetLanguageTestListResponse> => {
    const res = await axiosInstance.get<GetLanguageTestListResponse>(
      `/admin/scores/language-tests`, { params: params?.params }
    );
    return res.data;
  },

  deleteAdminCountriesCode: async (params: { code: string | number }): Promise<DeleteAdminCountriesCodeResponse> => {
    const res = await axiosInstance.delete<DeleteAdminCountriesCodeResponse>(
      `/admin/countries/${params.code}`
    );
    return res.data;
  },

  postAdminCountries: async (params: { data?: PostAdminCountriesRequest }): Promise<PostAdminCountriesResponse> => {
    const res = await axiosInstance.post<PostAdminCountriesResponse>(
      `/admin/countries`, params?.data
    );
    return res.data;
  },

  putAdminCountriesCode: async (params: { code: string | number, data?: PutAdminCountriesCodeRequest }): Promise<PutAdminCountriesCodeResponse> => {
    const res = await axiosInstance.put<PutAdminCountriesCodeResponse>(
      `/admin/countries/${params.code}`, params?.data
    );
    return res.data;
  },

  getAdminCountries: async (params: { params?: Record<string, unknown> }): Promise<GetAdminCountriesResponse> => {
    const res = await axiosInstance.get<GetAdminCountriesResponse>(
      `/admin/countries`, { params: params?.params }
    );
    return res.data;
  },

  putVerifyGpa: async (params: { gpaScoreId: string | number, data?: PutVerifyGpaRequest }): Promise<PutVerifyGpaResponse> => {
    const res = await axiosInstance.put<PutVerifyGpaResponse>(
      `/admin/scores/gpas/${params.gpaScoreId}`, params?.data
    );
    return res.data;
  },

  getGpaList: async (params: { params?: Record<string, unknown> }): Promise<GetGpaListResponse> => {
    const res = await axiosInstance.get<GetGpaListResponse>(
      `/admin/scores/gpas`, { params: params?.params }
    );
    return res.data;
  },

};
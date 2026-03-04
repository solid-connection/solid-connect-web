import { axiosInstance } from "../../../runtime/axiosInstance";

export type DeleteAdminRegionsCodeResponse = void;

export type DeleteAdminRegionsCodeRequest = Record<string, never>;

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

export type DeleteAdminCountriesCodeRequest = Record<string, never>;

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
  deleteAdminRegionsCode: async (params: { code: string | number, data?: DeleteAdminRegionsCodeRequest }): Promise<DeleteAdminRegionsCodeResponse> => {
    const res = await axiosInstance.request<DeleteAdminRegionsCodeResponse>({
      url: `/admin/regions/${params.code}`,
      method: "DELETE",
      data: params?.data,
    });
    return res.data;
  },

  postAdminRegions: async (params: { data?: PostAdminRegionsRequest }): Promise<PostAdminRegionsResponse> => {
    const res = await axiosInstance.request<PostAdminRegionsResponse>({
      url: `/admin/regions`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  putAdminRegionsCode: async (params: { code: string | number, data?: PutAdminRegionsCodeRequest }): Promise<PutAdminRegionsCodeResponse> => {
    const res = await axiosInstance.request<PutAdminRegionsCodeResponse>({
      url: `/admin/regions/${params.code}`,
      method: "PUT",
      data: params?.data,
    });
    return res.data;
  },

  getAdminRegions: async (params: { params?: Record<string, unknown> }): Promise<GetAdminRegionsResponse> => {
    const res = await axiosInstance.request<GetAdminRegionsResponse>({
      url: `/admin/regions`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  postRejectMentorApplication: async (params: { mentorApplicationId: string | number, data?: PostRejectMentorApplicationRequest }): Promise<PostRejectMentorApplicationResponse> => {
    const res = await axiosInstance.request<PostRejectMentorApplicationResponse>({
      url: `/admin/mentor-applications/${params.mentorApplicationId}/reject`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  getMentorApplicationList: async (params: { params?: Record<string, unknown> }): Promise<GetMentorApplicationListResponse> => {
    const res = await axiosInstance.request<GetMentorApplicationListResponse>({
      url: `/admin/mentor-applications`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  postApproveMentorApplication: async (params: { mentorApplicationId: string | number, data?: PostApproveMentorApplicationRequest }): Promise<PostApproveMentorApplicationResponse> => {
    const res = await axiosInstance.request<PostApproveMentorApplicationResponse>({
      url: `/admin/mentor-applications/${params.mentorApplicationId}/approve`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  postMappingMentorapplicationUniversity: async (params: { mentorApplicationId: string | number, data?: PostMappingMentorapplicationUniversityRequest }): Promise<PostMappingMentorapplicationUniversityResponse> => {
    const res = await axiosInstance.request<PostMappingMentorapplicationUniversityResponse>({
      url: `/admin/mentor-applications/${params.mentorApplicationId}/assign-university`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  getCountMentorApplicationByStatus: async (params: { params?: Record<string, unknown> }): Promise<GetCountMentorApplicationByStatusResponse> => {
    const res = await axiosInstance.request<GetCountMentorApplicationByStatusResponse>({
      url: `/admin/mentor-applications/count`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  getMentorApplicationHistoryList: async (params: { site_user_id: string | number, params?: Record<string, unknown> }): Promise<GetMentorApplicationHistoryListResponse> => {
    const res = await axiosInstance.request<GetMentorApplicationHistoryListResponse>({
      url: `/admin/mentor-applications/${params.site_user_id}/history`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  putVerifyLanguageTest: async (params: { languageTestScoreId: string | number, data?: PutVerifyLanguageTestRequest }): Promise<PutVerifyLanguageTestResponse> => {
    const res = await axiosInstance.request<PutVerifyLanguageTestResponse>({
      url: `/admin/scores/language-tests/${params.languageTestScoreId}`,
      method: "PUT",
      data: params?.data,
    });
    return res.data;
  },

  getLanguageTestList: async (params: { params?: Record<string, unknown> }): Promise<GetLanguageTestListResponse> => {
    const res = await axiosInstance.request<GetLanguageTestListResponse>({
      url: `/admin/scores/language-tests`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  deleteAdminCountriesCode: async (params: { code: string | number, data?: DeleteAdminCountriesCodeRequest }): Promise<DeleteAdminCountriesCodeResponse> => {
    const res = await axiosInstance.request<DeleteAdminCountriesCodeResponse>({
      url: `/admin/countries/${params.code}`,
      method: "DELETE",
      data: params?.data,
    });
    return res.data;
  },

  postAdminCountries: async (params: { data?: PostAdminCountriesRequest }): Promise<PostAdminCountriesResponse> => {
    const res = await axiosInstance.request<PostAdminCountriesResponse>({
      url: `/admin/countries`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  putAdminCountriesCode: async (params: { code: string | number, data?: PutAdminCountriesCodeRequest }): Promise<PutAdminCountriesCodeResponse> => {
    const res = await axiosInstance.request<PutAdminCountriesCodeResponse>({
      url: `/admin/countries/${params.code}`,
      method: "PUT",
      data: params?.data,
    });
    return res.data;
  },

  getAdminCountries: async (params: { params?: Record<string, unknown> }): Promise<GetAdminCountriesResponse> => {
    const res = await axiosInstance.request<GetAdminCountriesResponse>({
      url: `/admin/countries`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  putVerifyGpa: async (params: { gpaScoreId: string | number, data?: PutVerifyGpaRequest }): Promise<PutVerifyGpaResponse> => {
    const res = await axiosInstance.request<PutVerifyGpaResponse>({
      url: `/admin/scores/gpas/${params.gpaScoreId}`,
      method: "PUT",
      data: params?.data,
    });
    return res.data;
  },

  getGpaList: async (params: { params?: Record<string, unknown> }): Promise<GetGpaListResponse> => {
    const res = await axiosInstance.request<GetGpaListResponse>({
      url: `/admin/scores/gpas`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

};
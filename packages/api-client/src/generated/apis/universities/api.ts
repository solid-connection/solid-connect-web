import { axiosInstance } from "../../../runtime/axiosInstance";

export interface GetRecommendedUniversitiesResponseRecommendedUniversitiesItem {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: GetRecommendedUniversitiesResponseRecommendedUniversitiesItemLanguageRequirementsItem[];
}

export interface GetRecommendedUniversitiesResponseRecommendedUniversitiesItemLanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface GetRecommendedUniversitiesResponse {
  recommendedUniversities: GetRecommendedUniversitiesResponseRecommendedUniversitiesItem[];
}

export interface GetWishListResponseItem {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: GetWishListResponseItemLanguageRequirementsItem[];
}

export interface GetWishListResponseItemLanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export type GetWishListResponse = GetWishListResponseItem[];

export type DeleteWishResponse = void;

export type DeleteWishRequest = Record<string, never>;

export type PostAddWishResponse = void;

export type PostAddWishRequest = Record<string, never>;

export type GetIsWishResponse = void;

export interface GetUniversityDetailResponseLanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface GetUniversityDetailResponse {
  id: number;
  term: string;
  koreanName: string;
  englishName: string;
  formatName: string;
  region: string;
  country: string;
  homepageUrl: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  detailsForLocal: string;
  studentCapacity: number;
  tuitionFeeType: string;
  semesterAvailableForDispatch: string;
  languageRequirements: GetUniversityDetailResponseLanguageRequirementsItem[];
  detailsForLanguage: string;
  gpaRequirement: string;
  gpaRequirementCriteria: string;
  semesterRequirement: string;
  detailsForApply: null;
  detailsForMajor: string;
  detailsForAccommodation: null;
  detailsForEnglishCourse: null;
  details: string;
  accommodationUrl: string;
  englishCourseUrl: string;
}

export interface GetSearchTextResponseUnivApplyInfoPreviewsItem {
  id: number;
  term: string;
  koreanName: string;
  homeUniversityName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: GetSearchTextResponseUnivApplyInfoPreviewsItemLanguageRequirementsItem[];
}

export interface GetSearchTextResponseUnivApplyInfoPreviewsItemLanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface GetSearchTextResponse {
  univApplyInfoPreviews: GetSearchTextResponseUnivApplyInfoPreviewsItem[];
}

export type GetByRegionCountryResponse = void;

export const universitiesApi = {
  getRecommendedUniversities: async (params: { params?: Record<string, unknown> }): Promise<GetRecommendedUniversitiesResponse> => {
    const res = await axiosInstance.request<GetRecommendedUniversitiesResponse>({
      url: `/univ-apply-infos/recommend`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  getWishList: async (params: { params?: Record<string, unknown> }): Promise<GetWishListResponse> => {
    const res = await axiosInstance.request<GetWishListResponse>({
      url: `/univ-apply-infos/like`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  deleteWish: async (params: { univApplyInfoId: string | number, data?: DeleteWishRequest }): Promise<DeleteWishResponse> => {
    const res = await axiosInstance.request<DeleteWishResponse>({
      url: `/univ-apply-infos/${params.univApplyInfoId}/like`,
      method: "DELETE",
      data: params?.data,
    });
    return res.data;
  },

  postAddWish: async (params: { univApplyInfoId: string | number, data?: PostAddWishRequest }): Promise<PostAddWishResponse> => {
    const res = await axiosInstance.request<PostAddWishResponse>({
      url: `/univ-apply-infos/${params.univApplyInfoId}/like`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  getIsWish: async (params: { univApplyInfoId: string | number, params?: Record<string, unknown> }): Promise<GetIsWishResponse> => {
    const res = await axiosInstance.request<GetIsWishResponse>({
      url: `/univ-apply-infos/${params.univApplyInfoId}/like`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  getUniversityDetail: async (params: { univApplyInfoId: string | number, params?: Record<string, unknown> }): Promise<GetUniversityDetailResponse> => {
    const res = await axiosInstance.request<GetUniversityDetailResponse>({
      url: `/univ-apply-infos/${params.univApplyInfoId}`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  getSearchText: async (params: { params?: Record<string, unknown> }): Promise<GetSearchTextResponse> => {
    const res = await axiosInstance.request<GetSearchTextResponse>({
      url: `/univ-apply-infos/search/text`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  getByRegionCountry: async (params: { params?: Record<string, unknown> }): Promise<GetByRegionCountryResponse> => {
    const res = await axiosInstance.request<GetByRegionCountryResponse>({
      url: `/universities/search`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

};
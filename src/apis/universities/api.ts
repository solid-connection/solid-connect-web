import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

export interface RecommendedUniversitiesResponseRecommendedUniversitiesItem {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: RecommendedUniversitiesResponseRecommendedUniversitiesItemLanguageRequirementsItem[];
}

export interface RecommendedUniversitiesResponseRecommendedUniversitiesItemLanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface RecommendedUniversitiesResponse {
  recommendedUniversities: RecommendedUniversitiesResponseRecommendedUniversitiesItem[];
}

export interface WishListResponseItem {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: WishListResponseItemLanguageRequirementsItem[];
}

export interface WishListResponseItemLanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface WishListResponse {
  0: WishListResponseItem[];
  1: WishListResponseItem[];
}

export type WishResponse = undefined;

export type AddWishResponse = undefined;

export type AddWishRequest = Record<string, never>;

export type IsWishResponse = undefined;

export interface UniversityDetailResponseLanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface UniversityDetailResponse {
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
  languageRequirements: UniversityDetailResponseLanguageRequirementsItem[];
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

export interface SearchTextResponseUnivApplyInfoPreviewsItem {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: SearchTextResponseUnivApplyInfoPreviewsItemLanguageRequirementsItem[];
}

export interface SearchTextResponseUnivApplyInfoPreviewsItemLanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface SearchTextResponse {
  univApplyInfoPreviews: SearchTextResponseUnivApplyInfoPreviewsItem[];
}

export interface SearchFilterResponseUnivApplyInfoPreviewsItem {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: SearchFilterResponseUnivApplyInfoPreviewsItemLanguageRequirementsItem[];
}

export interface SearchFilterResponseUnivApplyInfoPreviewsItemLanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface SearchFilterResponse {
  univApplyInfoPreviews: SearchFilterResponseUnivApplyInfoPreviewsItem[];
}

export type ByRegionCountryResponse = undefined;

export const universitiesApi = {
  getRecommendedUniversities: async (params?: { isLogin?: boolean }): Promise<RecommendedUniversitiesResponse> => {
    const instance = params?.isLogin ? axiosInstance : publicAxiosInstance;
    const res = await instance.get<RecommendedUniversitiesResponse>(`/univ-apply-infos/recommend`);
    return res.data;
  },

  getWishList: async (params: { params?: Record<string, any> }): Promise<WishListResponse> => {
    const res = await axiosInstance.get<WishListResponse>(`/univ-apply-infos/like`, { params: params?.params });
    return res.data;
  },

  deleteWish: async (params: { univApplyInfoId: string | number }): Promise<WishResponse> => {
    const res = await axiosInstance.delete<WishResponse>(`/univ-apply-infos/${params.univApplyInfoId}/like`);
    return res.data;
  },

  postAddWish: async (params: {
    univApplyInfoId: string | number;
    data?: AddWishRequest;
  }): Promise<AddWishResponse> => {
    const res = await axiosInstance.post<AddWishResponse>(
      `/univ-apply-infos/${params.univApplyInfoId}/like`,
      params?.data,
    );
    return res.data;
  },

  getIsWish: async (params: {
    univApplyInfoId: string | number;
    params?: Record<string, any>;
  }): Promise<IsWishResponse> => {
    const res = await axiosInstance.get<IsWishResponse>(`/univ-apply-infos/${params.univApplyInfoId}/like`, {
      params: params?.params,
    });
    return res.data;
  },

  getUniversityDetail: async (params: { univApplyInfoId: string | number }): Promise<UniversityDetailResponse> => {
    const res = await publicAxiosInstance.get<UniversityDetailResponse>(`/univ-apply-infos/${params.univApplyInfoId}`);
    return res.data;
  },

  getSearchText: async (params?: { value?: string }): Promise<SearchTextResponse> => {
    const res = await publicAxiosInstance.get<SearchTextResponse>(`/univ-apply-infos/search/text`, {
      params: { value: params?.value ?? "" },
    });
    return res.data;
  },

  getSearchFilter: async (params?: { params?: Record<string, any> }): Promise<SearchFilterResponse> => {
    const res = await publicAxiosInstance.get<SearchFilterResponse>(`/univ-apply-infos/search/filter`, {
      params: params?.params,
    });
    return res.data;
  },

  getByRegionCountry: async (params: { params?: Record<string, any> }): Promise<ByRegionCountryResponse> => {
    const res = await axiosInstance.get<ByRegionCountryResponse>(`/universities/search`, { params: params?.params });
    return res.data;
  },
};

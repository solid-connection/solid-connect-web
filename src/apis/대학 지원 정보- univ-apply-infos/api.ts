import { axiosInstance } from "@/utils/axiosInstance";

export type 사용자 맞춤 대학 추천Response = void;

export type 위시 학교 목록 조회Response = void;

export type 위시 학교 삭제Response = void;

export type 위시 학교 추가Response = void;

export type 위시 학교 추가Request = Record<string, never>;

export type 위시 학교인지 조회Response = void;

export interface 학교 상세 정보 조회ResponseLanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface 학교 상세 정보 조회Response {
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
  languageRequirements: 학교 상세 정보 조회ResponseLanguageRequirementsItem[];
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

export type 학교 텍스트 검색Response = void;

export const 대학 지원 정보 univApplyInfosApi = {
  get사용자 맞춤 대학 추천: async (params: { params?: Record<string, any> }): Promise<사용자 맞춤 대학 추천Response> => {
    const res = await axiosInstance.get<사용자 맞춤 대학 추천Response>(
      `/univ-apply-infos/recommend`, { params: params?.params }
    );
    return res.data;
  },

  get위시 학교 목록 조회: async (params: { params?: Record<string, any> }): Promise<위시 학교 목록 조회Response> => {
    const res = await axiosInstance.get<위시 학교 목록 조회Response>(
      `/univ-apply-infos/like`, { params: params?.params }
    );
    return res.data;
  },

  delete위시 학교 삭제: async (params: { univApplyInfoId: string | number }): Promise<위시 학교 삭제Response> => {
    const res = await axiosInstance.delete<위시 학교 삭제Response>(
      `/univ-apply-infos/${params.univApplyInfoId}/like`
    );
    return res.data;
  },

  post위시 학교 추가: async (params: { univApplyInfoId: string | number, data?: 위시 학교 추가Request }): Promise<위시 학교 추가Response> => {
    const res = await axiosInstance.post<위시 학교 추가Response>(
      `/univ-apply-infos/${params.univApplyInfoId}/like`, params?.data
    );
    return res.data;
  },

  get위시 학교인지 조회: async (params: { univApplyInfoId: string | number, params?: Record<string, any> }): Promise<위시 학교인지 조회Response> => {
    const res = await axiosInstance.get<위시 학교인지 조회Response>(
      `/univ-apply-infos/${params.univApplyInfoId}/like`, { params: params?.params }
    );
    return res.data;
  },

  get학교 상세 정보 조회: async (params: { univApplyInfoId: string | number, params?: Record<string, any> }): Promise<학교 상세 정보 조회Response> => {
    const res = await axiosInstance.get<학교 상세 정보 조회Response>(
      `/univ-apply-infos/${params.univApplyInfoId}`, { params: params?.params }
    );
    return res.data;
  },

  get학교 텍스트 검색: async (params: { params?: Record<string, any> }): Promise<학교 텍스트 검색Response> => {
    const res = await axiosInstance.get<학교 텍스트 검색Response>(
      `/univ-apply-infos/search/text?value=일본`, { params: params?.params }
    );
    return res.data;
  },

};
import { AxiosResponse } from "axios";

import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import {
  ListUniversity,
  RecommendedUniversitiesResponse,
  University,
  UniversityFavoriteResponse,
  UniversityFavoriteStatusResponse,
} from "@/types/university";

export const getUniversityDetailPublicApi = (universityInfoForApplyId: number): Promise<AxiosResponse<University>> => {
  // TODO: 인증 포함 API로 변경 필요
  return publicAxiosInstance.get(`/university/detail/${universityInfoForApplyId}`);
};

export const getUniversityListPublicApi = (): Promise<AxiosResponse<ListUniversity[]>> => {
  return publicAxiosInstance.get("/university/search");
};

export const getUniversityFavoriteStatusApi = (
  universityInfoForApplyId: number,
): Promise<AxiosResponse<UniversityFavoriteStatusResponse>> => {
  return axiosInstance.get(`/university/${universityInfoForApplyId}/like`);
};

export const postUniversityFavoriteApi = (
  universityInfoForApplyId: number,
): Promise<AxiosResponse<UniversityFavoriteResponse>> => {
  return axiosInstance.post(`/university/${universityInfoForApplyId}/like`);
};

export const getRecommendedUniversitiesApi = (): Promise<AxiosResponse<RecommendedUniversitiesResponse>> => {
  return axiosInstance.get("/university/recommends");
};

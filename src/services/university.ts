import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { University, ListUniversity, RecommendedUniversitiesResponse, UniversityFavoriteResponse } from "@/types/university";

export const getUniversityDetailPublicApi = (universityInfoForApplyId: number): Promise<AxiosResponse<University>> => {
  // TODO: 인증 포함 API로 변경 필요
  return publicAxiosInstance.get(`/university/detail/${universityInfoForApplyId}`);
};

export const getUniversityListPublicApi = (): Promise<AxiosResponse<ListUniversity[]>> => {
  return publicAxiosInstance.get("/university/search");
};

export const postUniversityFavoriteApi = (universityInfoForApplyId: number): Promise<AxiosResponse<UniversityFavoriteResponse>> => {
  return axiosInstance.post(`/university/favorite/${universityInfoForApplyId}`);
};

export const getRecommendedUniversitiesApi = (): Promise<AxiosResponse<RecommendedUniversitiesResponse>> => {
  return axiosInstance.get("/university/recommends");
};

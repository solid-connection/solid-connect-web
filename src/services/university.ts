import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { College, ListCollege, RecommendedUniversitiesResponse, UniversityFavoriteResponse } from "@/types/college";

export const getUniversityDetailPublicApi = (universityInfoForApplyId: number): Promise<AxiosResponse<ApiResponse<College>>> => {
  // TODO: 인증 포함 API로 변경 필요
  return publicAxiosInstance.get(`/university/detail/${universityInfoForApplyId}`);
};

export const getUniversityListPublicApi = (): Promise<AxiosResponse<ApiResponse<ListCollege[]>>> => {
  return publicAxiosInstance.get("/university/search");
};

export const postUniversityFavoriteApi = (universityInfoForApplyId: number): Promise<AxiosResponse<ApiResponse<UniversityFavoriteResponse>>> => {
  return axiosInstance.post(`/university/favorite/${universityInfoForApplyId}`);
};

export const getRecommendedUniversitiesApi = (): Promise<AxiosResponse<ApiResponse<RecommendedUniversitiesResponse>>> => {
  return axiosInstance.get("/home");
};

import { AxiosResponse } from "axios";

import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import {
  ListUniversity,
  RegionEnum,
  University,
  UniversityFavoriteResponse,
  UniversityFavoriteStatusResponse,
} from "@/types/university";

export const getUniversityDetailPublicApi = (universityInfoForApplyId: number): Promise<AxiosResponse<University>> =>
  // TODO: 인증 포함 API로 변경 필요
  publicAxiosInstance.get(`/universities/${universityInfoForApplyId}`);

export const getUniversityListPublicApi = (region?: RegionEnum | null): Promise<AxiosResponse<ListUniversity[]>> => {
  return publicAxiosInstance.get("/universities/search", {
    params: {
      region: region,
    },
  });
};

export const getUniversityFavoriteStatusApi = (
  universityInfoForApplyId: number,
): Promise<AxiosResponse<UniversityFavoriteStatusResponse>> =>
  axiosInstance.get(`/universities/${universityInfoForApplyId}/like`);

export const postUniversityFavoriteApi = (
  universityInfoForApplyId: number,
): Promise<AxiosResponse<UniversityFavoriteResponse>> =>
  axiosInstance.post(`/universities/${universityInfoForApplyId}/like`);

export const deleteUniversityFavoriteApi = (
  universityInfoForApplyId: number,
): Promise<AxiosResponse<UniversityFavoriteResponse>> =>
  axiosInstance.delete(`/universities/${universityInfoForApplyId}/like`);

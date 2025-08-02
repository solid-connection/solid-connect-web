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
  publicAxiosInstance.get(`/univ-apply-infos/${universityInfoForApplyId}`);

export const getUniversityListPublicApi = (region?: RegionEnum | null): Promise<AxiosResponse<ListUniversity[]>> => {
  return publicAxiosInstance.get("/univ-apply-infos/search", {
    params: {
      region: region,
    },
  });
};

export const getUniversityFavoriteStatusApi = (
  universityInfoForApplyId: number,
): Promise<AxiosResponse<UniversityFavoriteStatusResponse>> =>
  axiosInstance.get(`/univ-apply-infos/${universityInfoForApplyId}/like`);

export const postUniversityFavoriteApi = (
  universityInfoForApplyId: number,
): Promise<AxiosResponse<UniversityFavoriteResponse>> =>
  axiosInstance.post(`/univ-apply-infos/${universityInfoForApplyId}/like`);

export const deleteUniversityFavoriteApi = (
  universityInfoForApplyId: number,
): Promise<AxiosResponse<UniversityFavoriteResponse>> =>
  axiosInstance.delete(`/univ-apply-infos/${universityInfoForApplyId}/like`);

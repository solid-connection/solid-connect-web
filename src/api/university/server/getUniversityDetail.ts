import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

import { University } from "@/types/university";

/**
 * @description 대학 상세 조회 서버 사이드 API 함수
 * @param universityInfoForApplyId - 대학 ID
 * @returns Promise<University>
 */
export const getUniversityDetail = async (universityInfoForApplyId: number): Promise<University> => {
  const response: AxiosResponse<University> = await publicAxiosInstance.get(
    `/univ-apply-infos/${universityInfoForApplyId}`,
  );
  return response.data;
};

import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { University } from "@/types/university";

import { useQuery } from "@tanstack/react-query";

/**
 * @description 대학 상세 조회 API 함수 (공개)
 * @param universityInfoForApplyId - 대학 ID
 * @returns Promise<University>
 */
const getUniversityDetail = async (universityInfoForApplyId: number): Promise<University> => {
  const response: AxiosResponse<University> = await publicAxiosInstance.get(
    `/univ-apply-infos/${universityInfoForApplyId}`,
  );
  return response.data;
};

/**
 * @description 대학 상세 조회를 위한 useQuery 커스텀 훅
 */
const useGetUniversityDetail = (universityInfoForApplyId: number) => {
  return useQuery({
    queryKey: [QueryKeys.universityDetail, universityInfoForApplyId],
    queryFn: () => getUniversityDetail(universityInfoForApplyId),
    enabled: !!universityInfoForApplyId,
  });
};

export default useGetUniversityDetail;

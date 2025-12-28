import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { universitiesApi, UniversityDetailResponse } from "./api";
import { QueryKeys } from "../queryKeys";
import { University } from "@/types/university";

/**
 * @description 대학 상세 조회를 위한 useQuery 커스텀 훅
 * @param universityInfoForApplyId - 대학 ID
 */
const useGetUniversityDetail = (universityInfoForApplyId: number) => {
  return useQuery<UniversityDetailResponse, AxiosError, University>({
    queryKey: [QueryKeys.universities.universityDetail, universityInfoForApplyId],
    queryFn: () => universitiesApi.getUniversityDetail({ univApplyInfoId: universityInfoForApplyId }),
    enabled: !!universityInfoForApplyId,
    select: (data) => data as unknown as University,
  });
};

export default useGetUniversityDetail;
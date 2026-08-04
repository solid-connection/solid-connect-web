import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import type { University } from "@/types/university";
import { QueryKeys } from "../queryKeys";
import { type UniversityDetailResponse, universitiesApi } from "./api";

/**
 * @description 대학 상세 조회를 위한 useQuery 커스텀 훅
 * @param universityInfoForApplyId - 대학 ID
 *
 * 이 훅은 SSG/서버 렌더 단계에서 상세 데이터를 못 가져왔을 때의 CSR 폴백(UniversityDetailCsrFallback)
 * 전용이다. 조회 실패 시 폴백 UI(UniversityDetailPreparingFallback)가 이미 사용자에게 상황을 안내하므로,
 * 전역 에러 토스트("오류가 발생했습니다...")가 중복으로 뜨지 않도록 스킵한다.
 */
const useGetUniversityDetail = (universityInfoForApplyId: number) => {
  return useQuery<UniversityDetailResponse, AxiosError, University>({
    queryKey: [QueryKeys.universities.universityDetail, universityInfoForApplyId],
    queryFn: () => universitiesApi.getUniversityDetail({ univApplyInfoId: universityInfoForApplyId }),
    enabled: !!universityInfoForApplyId,
    select: (data) => data as unknown as University,
    meta: SKIP_GLOBAL_ERROR_TOAST_META,
  });
};

export default useGetUniversityDetail;

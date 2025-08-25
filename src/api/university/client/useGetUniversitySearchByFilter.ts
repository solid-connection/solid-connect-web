import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

// QueryKeys에 universitySearchFilter 추가 필요
import { CountryCode, LanguageTestType, ListUniversity } from "@/types/university";

// ListUniversity 타입 경로
import { useQuery } from "@tanstack/react-query";

// --- 타입 정의 ---
export interface UniversitySearchFilterParams {
  languageTestType?: LanguageTestType;
  testScore?: number;
  countryCode?: CountryCode[];
}

interface UniversitySearchFilterResponse {
  univApplyInfoPreviews: ListUniversity[];
}

// --- API 호출 함수 ---
const getUniversitySearchByFilter = async (
  filters: UniversitySearchFilterParams,
): Promise<UniversitySearchFilterResponse> => {
  const response: AxiosResponse<UniversitySearchFilterResponse> = await axiosInstance.get(
    "/univ-apply-infos/search/filter",
    {
      params: filters,
      // Axios는 배열 값을 올바르게 직렬화합니다 (e.g., countryCode=JP&countryCode=CN)
    },
  );
  return response.data;
};

// --- 커스텀 훅 ---
const useGetUniversitySearchByFilter = (filters: UniversitySearchFilterParams) => {
  return useQuery<UniversitySearchFilterResponse, Error, ListUniversity[]>({
    queryKey: [QueryKeys.universitySearchFilter, filters],
    queryFn: () => getUniversitySearchByFilter(filters),
    // 필터 객체에 값이 하나라도 있을 때만 쿼리를 실행합니다.
    enabled: Object.values(filters).some((value) => value !== undefined && value !== ""),
    // 실제 컴포넌에는 univApplyInfoPreviews 배열만 전달합니다.
    select: (data) => data.univApplyInfoPreviews,
  });
};

export default useGetUniversitySearchByFilter;

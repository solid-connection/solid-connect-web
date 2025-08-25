import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { CountryCode, LanguageTestType, ListUniversity } from "@/types/university";

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
  const params = new URLSearchParams();

  if (filters.languageTestType) {
    params.append("languageTestType", filters.languageTestType);
  }
  if (filters.testScore !== undefined) {
    params.append("testScore", String(filters.testScore));
  }
  if (filters.countryCode) {
    filters.countryCode.forEach((code) => {
      params.append("countryCode", code);
    });
  }

  const response: AxiosResponse<UniversitySearchFilterResponse> = await publicAxiosInstance.get(
    `/univ-apply-infos/search/filter?${params.toString()}`,
  );
  return response.data;
};

// --- 커스텀 훅 ---
const useGetUniversitySearchByFilter = (filters: UniversitySearchFilterParams) => {
  return useQuery<UniversitySearchFilterResponse, Error, ListUniversity[]>({
    queryKey: [QueryKeys.universitySearchFilter, filters],
    queryFn: () => getUniversitySearchByFilter(filters),
    enabled: Object.values(filters).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== "";
    }),
    select: (data) => data.univApplyInfoPreviews,
  });
};

export default useGetUniversitySearchByFilter;

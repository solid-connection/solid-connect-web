import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { SearchFilterResponse, universitiesApi } from "./api";

import { CountryCode, LanguageTestType, ListUniversity } from "@/types/university";

import { useQuery } from "@tanstack/react-query";

export interface UniversitySearchFilterParams {
  languageTestType?: LanguageTestType;
  testScore?: number;
  countryCode?: CountryCode[];
}

/**
 * @description 필터로 대학 검색을 위한 useQuery 커스텀 훅
 * @param filters - 검색 필터 파라미터
 */
const useGetUniversitySearchByFilter = (filters: UniversitySearchFilterParams) => {
  // 필터 파라미터 구성
  const buildParams = () => {
    const params: Record<string, any> = {};
    if (filters.languageTestType) {
      params.languageTestType = filters.languageTestType;
    }
    if (filters.testScore !== undefined) {
      params.testScore = String(filters.testScore);
    }
    if (filters.countryCode && filters.countryCode.length > 0) {
      params.countryCode = filters.countryCode;
    }
    return params;
  };

  return useQuery<SearchFilterResponse, AxiosError, ListUniversity[]>({
    queryKey: [QueryKeys.universities.searchFilter, filters],
    queryFn: () => universitiesApi.getSearchFilter({ params: buildParams() }),
    enabled: Object.values(filters).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== "";
    }),
    select: (data) => data.univApplyInfoPreviews as unknown as ListUniversity[],
  });
};

export default useGetUniversitySearchByFilter;

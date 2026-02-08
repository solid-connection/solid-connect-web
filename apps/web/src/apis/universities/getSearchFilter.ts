import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useMemo } from "react";
import type { CountryCode, HomeUniversityName, LanguageTestType, ListUniversity } from "@/types/university";
import { QueryKeys } from "../queryKeys";
import { type SearchFilterResponse, universitiesApi } from "./api";

export interface UniversitySearchFilterParams {
  languageTestType?: LanguageTestType;
  testScore?: number;
  countryCode?: CountryCode[];
}

// API 응답에 homeUniversityName이 포함된 타입
interface ListUniversityWithHome extends ListUniversity {
  homeUniversityName?: HomeUniversityName;
}

/**
 * @description 필터로 대학 검색을 위한 useQuery 커스텀 훅
 * @param filters - 검색 필터 파라미터
 * @param homeUniversityName - 홈 대학교 이름 (선택적 필터)
 */
const useGetUniversitySearchByFilter = (
  filters: UniversitySearchFilterParams,
  homeUniversityName?: HomeUniversityName,
) => {
  // 필터 파라미터 구성
  const buildParams = () => {
    const params: Record<string, unknown> = {};
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

  const query = useQuery<SearchFilterResponse, AxiosError, ListUniversityWithHome[]>({
    queryKey: [QueryKeys.universities.searchFilter, filters],
    queryFn: () => universitiesApi.getSearchFilter({ params: buildParams() }),
    enabled: Object.values(filters).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== "";
    }),
    select: (data) => data.univApplyInfoPreviews as unknown as ListUniversityWithHome[],
  });

  // homeUniversityName으로 필터링
  const filteredData = useMemo(() => {
    if (!query.data || !homeUniversityName) return query.data;
    return query.data.filter((university) => university.homeUniversityName === homeUniversityName);
  }, [query.data, homeUniversityName]);

  return {
    ...query,
    data: filteredData,
  };
};

export default useGetUniversitySearchByFilter;

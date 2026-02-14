import { URLSearchParams } from "node:url";
import type { CountryCode, LanguageTestType, ListUniversity } from "@/types/university";
import serverFetch from "@/utils/serverFetchUtil";

interface UniversitySearchResponse {
  univApplyInfoPreviews: ListUniversity[];
}

/**
 * 필터 검색에 사용될 파라미터 타입
 */
export interface UniversitySearchFilterParams {
  languageTestType?: LanguageTestType;
  testScore?: number;
  countryCode?: CountryCode[];
}

export const getSearchUniversitiesByFilter = async (
  filters: UniversitySearchFilterParams,
): Promise<ListUniversity[]> => {
  const params = new URLSearchParams();

  if (filters.languageTestType) {
    params.append("languageTestType", filters.languageTestType);
  }
  if (filters.testScore !== undefined) {
    params.append("testScore", String(filters.testScore));
  }
  // countryCode는 여러 개일 수 있으므로 각각 append 해줍니다.
  if (filters.countryCode) {
    filters.countryCode.forEach((code) => params.append("countryCode", code));
  }

  // 필터 값이 하나도 없으면 빈 배열을 반환합니다.
  if (params.size === 0) {
    return [];
  }

  const endpoint = `/univ-apply-infos/search/filter?${params.toString()}`;
  const response = await serverFetch<UniversitySearchResponse>(endpoint);

  if (!response.ok) {
    console.error(`Failed to search universities by filter:`, response.error);
    return [];
  }

  return response.data.univApplyInfoPreviews;
};

export const getSearchUniversitiesAllRegions = async (): Promise<ListUniversity[]> => {
  const endpoint = `/univ-apply-infos/search/filter`;
  const response = await serverFetch<UniversitySearchResponse>(endpoint);

  if (!response.ok) {
    console.error(`Failed to fetch all regions universities:`, response.error);
    return [];
  }

  return response.data.univApplyInfoPreviews;
};

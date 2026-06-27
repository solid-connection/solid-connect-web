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
  termId?: number;
  homeUniversityId?: number;
}

const getUniversityTermId = () => {
  const termId = Number(process.env.UNIVERSITY_TERM_ID ?? process.env.NEXT_PUBLIC_UNIVERSITY_TERM_ID);

  return Number.isInteger(termId) && termId > 0 ? termId : undefined;
};

const normalizePositiveInt = (value: unknown) => {
  const numberValue = typeof value === "string" && value.trim() !== "" ? Number(value) : value;

  return typeof numberValue === "number" && Number.isInteger(numberValue) && numberValue > 0 ? numberValue : undefined;
};

const assertPositiveInt = (name: string, value: unknown) => {
  const positiveInt = normalizePositiveInt(value);

  if (positiveInt === undefined) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return positiveInt;
};

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
  if (filters.termId !== undefined) {
    params.append("termId", String(assertPositiveInt("termId", filters.termId)));
  }
  if (filters.homeUniversityId !== undefined) {
    params.append("homeUniversityId", String(assertPositiveInt("homeUniversityId", filters.homeUniversityId)));
  }

  // 필터 값이 하나도 없으면 빈 배열을 반환합니다.
  if (params.size === 0) {
    return [];
  }

  const endpoint = `/univ-apply-infos/search/filter?${params.toString()}`;
  const response = await serverFetch<UniversitySearchResponse>(endpoint);

  if (!response.ok) {
    return [];
  }

  return response.data.univApplyInfoPreviews;
};

export const getSearchUniversitiesAllRegions = async (
  params: Pick<UniversitySearchFilterParams, "termId" | "homeUniversityId"> = {},
): Promise<ListUniversity[]> => {
  const termId = params.termId === undefined ? getUniversityTermId() : assertPositiveInt("termId", params.termId);
  const searchParams = new URLSearchParams({ value: "" });

  if (termId !== undefined) {
    searchParams.set("termId", String(termId));
  }

  if (params.homeUniversityId !== undefined) {
    searchParams.set("homeUniversityId", String(assertPositiveInt("homeUniversityId", params.homeUniversityId)));
  }

  const endpoint = `/univ-apply-infos/search/text?${searchParams.toString()}`;
  const response = await serverFetch<UniversitySearchResponse>(endpoint);

  if (!response.ok) {
    return [];
  }

  return response.data.univApplyInfoPreviews;
};

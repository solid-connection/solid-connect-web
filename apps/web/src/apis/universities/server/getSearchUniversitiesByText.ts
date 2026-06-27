import { URLSearchParams } from "node:url";
import { type AllRegionsUniversityList, type ListUniversity, RegionEnumExtend } from "@/types/university";
import serverFetch from "@/utils/serverFetchUtil";

// --- 타입 정의 ---
interface UniversitySearchResponse {
  univApplyInfoPreviews: ListUniversity[];
}

export interface UniversitySearchTextParams {
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

const createSearchTextEndpoint = (value: string, params: UniversitySearchTextParams = {}) => {
  const termId = params.termId === undefined ? getUniversityTermId() : assertPositiveInt("termId", params.termId);
  const searchParams = new URLSearchParams({ value });

  if (termId !== undefined) {
    searchParams.set("termId", String(termId));
  }

  if (params.homeUniversityId !== undefined) {
    searchParams.set("homeUniversityId", String(assertPositiveInt("homeUniversityId", params.homeUniversityId)));
  }

  return `/univ-apply-infos/search/text?${searchParams.toString()}`;
};

export const getUniversitiesByText = async (
  value: string,
  params?: UniversitySearchTextParams,
): Promise<ListUniversity[]> => {
  if (value === null || value === undefined) {
    return [];
  }
  const endpoint = createSearchTextEndpoint(value, params);
  const response = await serverFetch<UniversitySearchResponse>(endpoint);

  if (!response.ok) {
    return [];
  }

  return response.data.univApplyInfoPreviews;
};

export const getAllUniversities = async (params?: UniversitySearchTextParams): Promise<ListUniversity[]> => {
  return getUniversitiesByText("", params);
};

export const getCategorizedUniversities = async (
  params?: UniversitySearchTextParams,
): Promise<AllRegionsUniversityList> => {
  // 1. 단 한 번의 API 호출로 모든 대학 데이터를 가져옵니다.
  const allUniversities = await getAllUniversities(params);

  const categorizedList: AllRegionsUniversityList = {
    [RegionEnumExtend.ALL]: allUniversities,
    [RegionEnumExtend.AMERICAS]: [],
    [RegionEnumExtend.EUROPE]: [],
    [RegionEnumExtend.ASIA]: [],
    [RegionEnumExtend.CHINA]: [],
  };
  if (!allUniversities) return categorizedList;

  for (const university of allUniversities) {
    const region = university.region as RegionEnumExtend; // API 응답의 region 타입을 enum으로 간주

    if (region && Object.hasOwn(categorizedList, region)) {
      categorizedList[region].push(university);
    }
  }

  return categorizedList;
};

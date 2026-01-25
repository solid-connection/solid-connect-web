import { type AllRegionsUniversityList, type ListUniversity, RegionEnumExtend } from "@/types/university";
import serverFetch from "@/utils/serverFetchUtil";

// --- 타입 정의 ---
interface UniversitySearchResponse {
  univApplyInfoPreviews: ListUniversity[];
}

export const getUniversitiesByText = async (value: string): Promise<ListUniversity[]> => {
  if (value === null || value === undefined) {
    return [];
  }
  const endpoint = `/univ-apply-infos/search/text?value=${encodeURIComponent(value)}`;
  const response = await serverFetch<UniversitySearchResponse>(endpoint);
  return response.ok ? response.data.univApplyInfoPreviews : [];
};

export const getAllUniversities = async (): Promise<ListUniversity[]> => {
  return getUniversitiesByText("");
};

export const getCategorizedUniversities = async (): Promise<AllRegionsUniversityList> => {
  // 1. 단 한 번의 API 호출로 모든 대학 데이터를 가져옵니다.
  const allUniversities = await getAllUniversities();

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

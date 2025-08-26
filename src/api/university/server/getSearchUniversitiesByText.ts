import serverFetch from "@/utils/serverFetchUtil";

import { COUNTRY_TO_REGION_MAP, REGION_KO_MAP } from "@/constants/university";
import { AllRegionsUniversityList, ListUniversity, RegionEnumExtend } from "@/types/university";

// --- 타입 정의 ---
interface UniversitySearchResponse {
  univApplyInfoPreviews: ListUniversity[];
}

// --- API 호출 함수 ---

/**
 * 텍스트로 대학을 검색합니다.
 * @param value 검색어. 빈 문자열("")을 전달하면 모든 대학을 가져옵니다.
 */
export const getUniversitiesByText = async (value: string): Promise<ListUniversity[]> => {
  // value가 null이나 undefined인 경우만 방지하고, 빈 문자열은 허용합니다.
  if (value === null || value === undefined) {
    return [];
  }

  const endpoint = `/univ-apply-infos/search/text?value=${encodeURIComponent(value)}`;
  const response = await serverFetch<UniversitySearchResponse>(endpoint);

  return response.ok ? response.data.univApplyInfoPreviews : [];
};

/**
 * 모든 대학 목록을 가져옵니다.
 */
export const getAllUniversities = async (): Promise<ListUniversity[]> => {
  // 빈 문자열로 검색하여 모든 대학을 가져오는 새 API를 활용합니다.
  return getUniversitiesByText("");
};

/**
 * 모든 대학 데이터를 가져와 지역별로 분류합니다.
 * 이 함수가 기존의 getUniversitiesByAllRegion을 대체합니다.
 */
export const getCategorizedUniversities = async (): Promise<AllRegionsUniversityList> => {
  // 1. 단 한 번의 API 호출로 모든 대학 데이터를 가져옵니다.
  const allUniversities = await getAllUniversities();

  // 2. 가져온 데이터를 지역별로 분류합니다.
  const categorizedList: AllRegionsUniversityList = {
    [RegionEnumExtend.ALL]: allUniversities,
    [RegionEnumExtend.AMERICAS]: [],
    [RegionEnumExtend.EUROPE]: [],
    [RegionEnumExtend.ASIA]: [],
    [RegionEnumExtend.CHINA]: [],
  };

  // 각 대학의 국가 정보를 기반으로 지역을 찾아 분류합니다.
  for (const university of allUniversities) {
    // university 객체에 국가 이름이 'country' 속성으로 있다고 가정합니다.
    const countryName = university.country;
    const region = COUNTRY_TO_REGION_MAP[countryName]; // 국가-지역 매핑 객체 활용

    if (region && categorizedList[region]) {
      categorizedList[region].push(university);
    }
  }

  return categorizedList;
};

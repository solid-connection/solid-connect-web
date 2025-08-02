import serverFetch from "@/utils/serverFetchUtil";

import { SearchUniversityListResponse } from "../type/response";

import { AllRegionsUniversityList, RegionEnum, RegionEnumExtend } from "@/types/university";

/**
 * 검색 파라미터 정의
 */
interface SearchParams {
  region?: RegionEnum | null;
  keyword?: string;
  testType?: string;
  testScore?: string;
}

/**
 * 단일 권역 또는 조건별 대학 검색 API
 * - 기본 경로: /univ-apply-infos/search
 * - 필요 시 query string 을 동적으로 붙인다.
 */
const getSearchUniversityList = async ({ region, keyword, testType, testScore }: SearchParams = {}) => {

  const endpoint = process.env.NODE_ENV !== "development" ? "/univ-apply-infos/search" : "/universities/search";


  const params = new URLSearchParams();

  if (region) params.append("region", region);
  if (keyword) params.append("keyword", keyword);
  if (testType) params.append("testType", testType);
  if (testScore) params.append("testScore", testScore);

  const url = params.size ? `${endpoint}?${params.toString()}` : endpoint;

  return serverFetch<SearchUniversityListResponse>(url, { isAuth: false });
};

/**
 * 전체·미주·유럽·아시아·중국 데이터를 병렬로 가져와
 * Record<RegionEnumExtend, ListUniversity[]> 형태로 반환한다.
 */
export async function getAllRegionsUniversityList(): Promise<AllRegionsUniversityList> {
  const regionOrder: (RegionEnum | null)[] = [
    null,
    RegionEnum.AMERICAS,
    RegionEnum.EUROPE,
    RegionEnum.ASIA,
    RegionEnum.CHINA,
  ];

  // ALL(전체)은 region 파라미터를 넘기지 않는다.
  const responses = await Promise.all(regionOrder.map((region) => getSearchUniversityList({ region })));

  const regionEnumExtendedOrder: RegionEnumExtend[] = [
    RegionEnumExtend.ALL,
    RegionEnumExtend.AMERICAS,
    RegionEnumExtend.EUROPE,
    RegionEnumExtend.ASIA,
    RegionEnumExtend.CHINA,
  ];

  return regionEnumExtendedOrder.reduce((acc, key, idx) => {
    const response = responses[idx];
    acc[key] = response.ok ? response.data : [];
    return acc;
  }, {} as AllRegionsUniversityList);
}

export default getSearchUniversityList;

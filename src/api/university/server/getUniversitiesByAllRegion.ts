import { URLSearchParams } from "url";

import serverFetch from "@/utils/serverFetchUtil";

import { COUNTRY_CODE_MAP, REGION_KO_MAP, REGION_TO_COUNTRIES_MAP } from "@/constants/university";
import {
  AllRegionsUniversityList,
  CountryCode,
  LanguageTestType,
  ListUniversity,
  RegionEnumExtend,
} from "@/types/university";

// --- 타입 정의 ---

interface UniversitySearchResponse {
  univApplyInfoPreviews: ListUniversity[];
}

export interface UniversitySearchFilterParams {
  countryCode?: CountryCode[];
  languageTestType?: LanguageTestType;
  testScore?: number;
}

// --- 데이터 구조화 ---

const COUNTRY_NAME_TO_CODE_MAP = new Map<string, CountryCode>(
  Object.entries(COUNTRY_CODE_MAP).map(([code, name]) => [name, code as CountryCode]),
);

// --- API 호출 함수 (필터 검색) ---

export const searchUniversitiesByFilter = async (filters: UniversitySearchFilterParams): Promise<ListUniversity[]> => {
  const params = new URLSearchParams();

  if (filters.languageTestType) {
    params.append("languageTestType", filters.languageTestType);
  }
  if (filters.testScore !== undefined) {
    params.append("testScore", String(filters.testScore));
  }
  if (filters.countryCode) {
    filters.countryCode.forEach((code) => params.append("countryCode", code));
  }

  const endpoint = `/univ-apply-infos/search/filter?${params.toString()}`;
  const response = await serverFetch<UniversitySearchResponse>(endpoint);

  return response.ok ? response.data.univApplyInfoPreviews : [];
};

// --- 최종 함수 ---

// --- 헬퍼 함수 추가 ---
const selectRandomItems = <T>(array: T[], count: number): T[] => {
  return [...array].sort(() => 0.5 - Math.random()).slice(0, count);
};

// --- 최종 함수 (수정됨) ---
export const getUniversitiesByAllRegion = async (): Promise<AllRegionsUniversityList> => {
  const regionOrder: RegionEnumExtend[] = [
    RegionEnumExtend.ALL,
    RegionEnumExtend.AMERICAS,
    RegionEnumExtend.EUROPE,
    RegionEnumExtend.ASIA,
    RegionEnumExtend.CHINA,
  ];

  const promises = regionOrder.map((regionKey) => {
    let filters: UniversitySearchFilterParams = {};
    let countryCodes: CountryCode[] = [];

    const regionKoName = REGION_KO_MAP[regionKey];
    const allCountriesInRegion = REGION_TO_COUNTRIES_MAP[regionKoName] || [];

    // 💡 국가 수가 많은 유럽권은 5개 국가만 랜덤 샘플링합니다.
    if (regionKey === RegionEnumExtend.EUROPE) {
      const randomCountries = selectRandomItems(allCountriesInRegion, 8);
      countryCodes = randomCountries
        .map((name) => COUNTRY_NAME_TO_CODE_MAP.get(name))
        .filter((code): code is CountryCode => !!code);
    } else if (regionKey !== RegionEnumExtend.ALL) {
      countryCodes = allCountriesInRegion
        .map((name) => COUNTRY_NAME_TO_CODE_MAP.get(name))
        .filter((code): code is CountryCode => !!code);
    }

    switch (regionKey) {
      case RegionEnumExtend.CHINA:
        filters = {
          languageTestType: LanguageTestType.NEW_HSK,
          testScore: 5,
        };
        break;
      // TODO 아시아권 국가 리스트 협의 필요
      case RegionEnumExtend.ASIA:
        filters = {
          languageTestType: LanguageTestType.IELTS,
          testScore: 10,
        };
        break;
      default:
        filters = {
          languageTestType: LanguageTestType.TOEFL_IBT,
          testScore: 80,
        };
        break;
    }

    // 국가 코드가 있으면 필터에 추가
    if (countryCodes.length > 0) {
      filters.countryCode = countryCodes;
    }

    return searchUniversitiesByFilter(filters);
  });

  const responses = await Promise.all(promises);

  return regionOrder.reduce((acc, key, idx) => {
    acc[key] = responses[idx] || [];
    return acc;
  }, {} as AllRegionsUniversityList);
};

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSearchUniversitiesAllRegions, getSearchUniversitiesByFilter } from "@/apis/universities/server";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import {
  COUNTRY_CODE_MAP,
  getHomeUniversityBySlug,
  HOME_UNIVERSITY_SLUGS,
  isMatchedHomeUniversityName,
} from "@/constants/university";
import { type CountryCode, type HomeUniversitySlug, LanguageTestType, RegionEnumExtend } from "@/types/university";

import UniversityListContent from "./_ui/UniversityListContent";

export const revalidate = 15552000; // 6개월마다 재검증 (ISR)

// 정적 경로 생성
export async function generateStaticParams() {
  return HOME_UNIVERSITY_SLUGS.map((slug) => ({
    homeUniversity: slug,
  }));
}

type PageProps = {
  params: Promise<{ homeUniversity: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
};

type SearchParamValue = string | string[] | undefined;

const getSearchParamValues = (value: SearchParamValue): string[] => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const getFirstSearchParamValue = (value: SearchParamValue): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

const isCountryCode = (value: string): value is CountryCode => {
  return Object.hasOwn(COUNTRY_CODE_MAP, value);
};

const isLanguageTestType = (value: string): value is LanguageTestType => {
  return Object.values(LanguageTestType).includes(value as LanguageTestType);
};

const isRegionFilterValue = (value: string): value is RegionEnumExtend => {
  return (
    value === RegionEnumExtend.AMERICAS ||
    value === RegionEnumExtend.EUROPE ||
    value === RegionEnumExtend.ASIA ||
    value === RegionEnumExtend.CHINA
  );
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { homeUniversity } = await params;
  const universityInfo = getHomeUniversityBySlug(homeUniversity);

  if (!universityInfo) {
    return {
      title: "파견 학교 목록",
    };
  }

  return {
    title: `${universityInfo.shortName} 교환학생 파견 학교 목록 | 솔리드커넥션`,
    description: `${universityInfo.name} 학생들을 위한 교환학생 파견 학교 정보를 확인하세요.`,
  };
}

const UniversityListPage = async ({ params, searchParams }: PageProps) => {
  const { homeUniversity } = await params;
  const initialSearchText = getFirstSearchParamValue(searchParams?.searchText).trim();
  const languageTestTypeParam = getFirstSearchParamValue(searchParams?.languageTestType).trim();
  const countryCodeParams = getSearchParamValues(searchParams?.countryCode).filter(isCountryCode);
  const regionParams = getSearchParamValues(searchParams?.region).filter(isRegionFilterValue);
  const initialRegion = regionParams.length === 1 ? regionParams[0] : RegionEnumExtend.ALL;
  const languageTestType = isLanguageTestType(languageTestTypeParam) ? languageTestTypeParam : undefined;

  // 유효한 슬러그인지 확인
  if (!HOME_UNIVERSITY_SLUGS.includes(homeUniversity as HomeUniversitySlug)) {
    notFound();
  }

  const universityInfo = getHomeUniversityBySlug(homeUniversity);

  if (!universityInfo) {
    notFound();
  }

  const shouldUseFilterApi = Boolean(languageTestType) || countryCodeParams.length > 0;

  const allUniversities = shouldUseFilterApi
    ? await getSearchUniversitiesByFilter({
        languageTestType,
        countryCode: countryCodeParams.length > 0 ? countryCodeParams : undefined,
      })
    : await getSearchUniversitiesAllRegions();

  // homeUniversityName으로 프론트에서 필터링
  let filteredUniversities = allUniversities.filter((university) =>
    isMatchedHomeUniversityName(university.homeUniversityName, universityInfo.name),
  );

  if (regionParams.length > 0) {
    filteredUniversities = filteredUniversities.filter((university) =>
      regionParams.includes(university.region as RegionEnumExtend),
    );
  }

  return (
    <>
      <TopDetailNavigation title={`${universityInfo.shortName} 파견학교`} backHref="/university" />
      <UniversityListContent
        universities={filteredUniversities}
        homeUniversity={universityInfo}
        homeUniversitySlug={homeUniversity}
        initialSearchText={initialSearchText}
        initialRegion={initialRegion}
      />
    </>
  );
};

export default UniversityListPage;

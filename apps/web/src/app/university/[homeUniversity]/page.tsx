import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSearchUniversitiesAllRegions } from "@/apis/universities/server";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { getHomeUniversityBySlug, HOME_UNIVERSITY_SLUGS, isMatchedHomeUniversityName } from "@/constants/university";
import type { HomeUniversitySlug } from "@/types/university";

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

const UniversityListPage = async ({ params }: PageProps) => {
  const { homeUniversity } = await params;

  // 유효한 슬러그인지 확인
  if (!HOME_UNIVERSITY_SLUGS.includes(homeUniversity as HomeUniversitySlug)) {
    notFound();
  }

  const universityInfo = getHomeUniversityBySlug(homeUniversity);

  if (!universityInfo) {
    notFound();
  }

  // 전체 대학 목록을 서버에서 가져옴 (ISR 캐시됨)
  const allUniversities = await getSearchUniversitiesAllRegions();

  // homeUniversityName으로 프론트에서 필터링
  const filteredUniversities = allUniversities.filter((university) =>
    isMatchedHomeUniversityName(university.homeUniversityName, universityInfo.name),
  );

  return (
    <>
      <TopDetailNavigation title={`${universityInfo.shortName} 파견학교`} backHref="/university" />
      <UniversityListContent
        universities={filteredUniversities}
        homeUniversity={universityInfo}
        homeUniversitySlug={homeUniversity}
      />
    </>
  );
};

export default UniversityListPage;

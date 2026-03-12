import type { Metadata } from "next";
import { notFound } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { HOME_UNIVERSITY_LIST, HOME_UNIVERSITY_SLUG_MAP } from "@/constants/university";
import type { HomeUniversityName, HomeUniversitySlug } from "@/types/university";

import SearchResultsContent from "./SearchResultsContent";

// ISR: 정적 페이지 생성
export const revalidate = false;

// 정적 경로 생성 (ISR)
export async function generateStaticParams() {
  return HOME_UNIVERSITY_LIST.map((university) => ({
    homeUniversityName: university.slug,
  }));
}

type PageProps = {
  params: Promise<{ homeUniversityName: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { homeUniversityName } = await params;

  const universityName = HOME_UNIVERSITY_SLUG_MAP[homeUniversityName as HomeUniversitySlug];

  if (!universityName) {
    return {
      title: "파견 학교 목록",
    };
  }

  return {
    title: `${universityName} 파견 학교 목록 | 솔리드커넥션`,
    description: `${universityName}에서 파견 가능한 교환학생 대학교 목록입니다. 지역별, 어학 요건별로 검색하고 관심있는 대학을 찾아보세요.`,
  };
}

const UniversityListPage = async ({ params }: PageProps) => {
  const { homeUniversityName } = await params;

  const universityName = HOME_UNIVERSITY_SLUG_MAP[homeUniversityName as HomeUniversitySlug] as
    | HomeUniversityName
    | undefined;

  if (!universityName) {
    notFound();
  }

  return (
    <>
      <TopDetailNavigation title={`${universityName} 파견학교`} />
      <SearchResultsContent homeUniversityName={universityName} />
    </>
  );
};

export default UniversityListPage;

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { HOME_UNIVERSITIES, HOME_UNIVERSITY_SLUG, type HomeUniversityName } from "@/types/university";

import SearchResultsContent from "./SearchResultsContent";

// ISR: 정적 페이지 생성
export const revalidate = false;

// 정적 경로 생성 (ISR)
export async function generateStaticParams() {
  return HOME_UNIVERSITIES.map((university) => ({
    homeUniversityName: university.slug,
  }));
}

type PageProps = {
  params: Promise<{ homeUniversityName: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { homeUniversityName } = await params;

  const universityName = HOME_UNIVERSITY_SLUG[homeUniversityName];

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

  const universityName = HOME_UNIVERSITY_SLUG[homeUniversityName] as HomeUniversityName | undefined;

  if (!universityName) {
    notFound();
  }

  return (
    <>
      <TopDetailNavigation title={`${universityName} 파견학교`} />
      <div className="mt-14 w-full px-5">
        <SearchResultsContent homeUniversityName={universityName} />
      </div>
    </>
  );
};

export default UniversityListPage;

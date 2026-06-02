import type { Metadata } from "next";
import { notFound } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { getHomeUniversityBySlug, HOME_UNIVERSITY_SLUGS } from "@/constants/university";
import type { HomeUniversitySlug } from "@/types/university";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

import SearchPageContent from "./_ui/SearchPageContent";

export const revalidate = false;
export const dynamicParams = false;

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
      title: "파견 학교 검색",
      robots: NO_INDEX_ROBOTS,
    };
  }

  const title = `${universityInfo.shortName} 파견 학교 검색 | 솔리드커넥션`;
  const description = `${universityInfo.name} 학생을 위한 맞춤 파견 학교를 검색하세요. 국가와 어학 조건을 기준으로 교환학생 지원 가능 대학을 찾아볼 수 있습니다.`;

  return {
    title,
    description,
    robots: NO_INDEX_ROBOTS,
  };
}

const SearchPage = async ({ params }: PageProps) => {
  const { homeUniversity } = await params;

  if (!HOME_UNIVERSITY_SLUGS.includes(homeUniversity as HomeUniversitySlug)) {
    notFound();
  }

  const universityInfo = getHomeUniversityBySlug(homeUniversity);

  if (!universityInfo) {
    notFound();
  }

  return (
    <>
      <TopDetailNavigation
        title={`${universityInfo.shortName} 파견학교 검색`}
        backHref={`/university/${homeUniversity}`}
      />
      <div className="w-full">
        <main className="flex flex-1 flex-col p-5">
          <h2 className="mb-1 typo-bold-1">오직 나를 위한</h2>
          <h2 className="mb-6 typo-bold-1">맞춤 파견 학교 찾기</h2>
          <SearchPageContent homeUniversitySlug={homeUniversity} />
        </main>
      </div>
    </>
  );
};

export default SearchPage;

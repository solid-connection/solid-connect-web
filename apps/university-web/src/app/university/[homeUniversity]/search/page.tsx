import type { Metadata } from "next";
import { notFound } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { getHomeUniversityBySlug, HOME_UNIVERSITY_SLUGS } from "@/constants/university";
import type { HomeUniversitySlug } from "@/types/university";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

import SearchPageContent, { DesktopSearchPageContent } from "./_ui/SearchPageContent";

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
      <div className="w-full md:hidden">
        <main className="flex flex-1 flex-col p-5">
          <h2 className="mb-1 typo-bold-1">오직 나를 위한</h2>
          <h2 className="mb-6 typo-bold-1">맞춤 파견 학교 찾기</h2>
          <SearchPageContent homeUniversitySlug={homeUniversity} />
        </main>
      </div>
      <div className="hidden min-h-screen bg-k-50 px-8 py-8 md:block lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <p className="text-primary typo-sb-9">{universityInfo.shortName} search</p>
            <h1 className="mt-2 text-k-900 typo-bold-1">맞춤 파견 학교 찾기</h1>
            <p className="mt-2 text-k-500 typo-medium-2">
              {universityInfo.shortName} 학생 기준으로 지역, 국가, 어학 조건에 맞는 학교를 찾아보세요.
            </p>
          </header>

          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
            <section className="rounded-lg border border-k-100 bg-white p-6">
              <h2 className="text-k-900 typo-bold-4">검색 조건</h2>
              <p className="mt-1 text-k-500 typo-medium-3">학교명, 지역, 국가, 어학 조건을 조합해서 찾아보세요.</p>
              <div className="mt-6">
                <DesktopSearchPageContent homeUniversitySlug={homeUniversity} />
              </div>
            </section>

            <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
              <h2 className="text-k-900 typo-bold-4">검색 기준</h2>
              <div className="mt-5 grid gap-3 text-k-700 typo-medium-2">
                <div className="rounded-lg bg-k-50 px-4 py-3">소속 학교: {universityInfo.name}</div>
                <div className="rounded-lg bg-k-50 px-4 py-3">지역을 여러 개 선택해 넓게 탐색할 수 있어요.</div>
                <div className="rounded-lg bg-k-50 px-4 py-3">국가는 최대 3개까지 조합할 수 있어요.</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;

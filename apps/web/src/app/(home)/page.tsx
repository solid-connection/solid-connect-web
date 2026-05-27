import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { getHomeNewsList } from "@/apis/news/server/getNewsList";
import { getCategorizedUniversities, getRecommendedUniversity } from "@/apis/universities/server";
import { type ListUniversity, RegionEnumExtend } from "@/types/university";
import FindLastYearScoreBar from "./_ui/FindLastYearScoreBar";
import HomeEntrySection from "./_ui/HomeEntrySection";
import NewsSectionSkeleton from "./_ui/NewsSection/skeleton";
import PopularUniversitySection from "./_ui/PopularUniversitySection";
import UniversityList from "./_ui/UniversityList";

const NewsSectionDynamic = nextDynamic(() => import("./_ui/NewsSection"), {
  ssr: false,
  loading: () => <NewsSectionSkeleton />,
});

const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://solid-connection.com";
const ogImageUrl = `${baseUrl}/opengraph-image.png`;
const homeMetaTitle = "교환학생 사이트 | 솔리드 커넥션 – 교환학생 커뮤니티, 플랫폼";

export const metadata: Metadata = {
  title: homeMetaTitle,
  description:
    "교환학생 사이트 솔리드커넥션. 교환학생 커뮤니티에서 학교 검색, 성적 입력, 지원 현황 확인까지 한 번에. 교환학생 준비를 위한 모든 정보를 제공합니다.",
  alternates: {
    canonical: `${baseUrl}/`,
  },
  openGraph: {
    title: homeMetaTitle,
    description:
      "교환학생 사이트 솔리드커넥션. 교환학생 커뮤니티에서 학교 검색, 성적 입력, 지원 현황 확인까지 한 번에. 교환학생 준비를 위한 모든 정보를 제공합니다.",
    url: `${baseUrl}/`,
    siteName: "솔리드커넥션",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "솔리드 커넥션 - 교환학생 커뮤니티",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeMetaTitle,
    description: "교환학생 사이트 솔리드커넥션. 교환학생 커뮤니티에서 학교 검색, 성적 입력, 지원 현황 확인까지.",
    images: [ogImageUrl],
  },
};

// Structured Data (JSON-LD) for SEO - 교환학생 사이트, 커뮤니티 키워드 강화
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "솔리드커넥션",
  url: `${baseUrl}/`,
  description: "교환학생 학교 검색, 성적 입력, 지원 현황 확인까지 가능한 교환학생 플랫폼.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/university?searchText={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const resolveRecommendedUniversitiesHomeUniversityName = (
  recommendedUniversities: ListUniversity[],
  allUniversities: ListUniversity[],
) => {
  const homeUniversityNameById = new Map(
    allUniversities.map((university) => [university.id, university.homeUniversityName]),
  );

  return recommendedUniversities.map((university) => ({
    ...university,
    homeUniversityName: university.homeUniversityName ?? homeUniversityNameById.get(university.id),
  }));
};

const HomePage = async () => {
  const newsList = await getHomeNewsList();
  const { data } = await getRecommendedUniversity();
  const recommendedUniversities = data?.recommendedUniversities || [];
  // 권역별 전체 대학 리스트를 미리 가져와 빌드합니다
  const allRegionsUniversityList = await getCategorizedUniversities();
  const allUniversities = allRegionsUniversityList[RegionEnumExtend.ALL] || [];
  const resolvedRecommendedUniversities = resolveRecommendedUniversitiesHomeUniversityName(
    recommendedUniversities,
    allUniversities,
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="w-full">
        <FindLastYearScoreBar />
        <HomeEntrySection />

        <div className="border-t-[5px] border-k-50 py-5 pl-5">
          <div className="mb-2 flex items-center gap-1.5 font-serif text-k-700 typo-sb-7">실시간 인기있는 파견학교</div>
          <PopularUniversitySection universities={resolvedRecommendedUniversities} />
        </div>

        <div className="p-5">
          <UniversityList allRegionsUniversityList={allRegionsUniversityList} />
        </div>

        <NewsSectionDynamic newsList={newsList} />
      </div>
    </>
  );
};

export default HomePage;

export const revalidate = 86400; // 1 day

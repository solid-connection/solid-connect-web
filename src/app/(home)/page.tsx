import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

import FindLastYearScoreBar from "./_ui/FindLastYearScoreBar";
import NewsSectionSkeleton from "./_ui/NewsSection/skeleton";
import PopularUniversitySection from "./_ui/PopularUniversitySection";
import UniversityList from "./_ui/UniversityList";

import { getCategorizedUniversities, getRecommendedUniversity } from "@/apis/universities/server";
import { fetchAllNews } from "@/lib/firebaseNews";
import { IconIdCard, IconMagnifyingGlass, IconMuseum, IconPaper } from "@/public/svgs/home";

const NewsSectionDynamic = dynamic(() => import("./_ui/NewsSection"), {
  ssr: false,
  loading: () => <NewsSectionSkeleton />,
});

const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://solid-connection.com";
const ogImageUrl = `${baseUrl}/opengraph-image.png`;

export const metadata: Metadata = {
  title: "교환학생 사이트 | 솔리드 커넥션 – 교환학생 커뮤니티",
  description:
    "교환학생 사이트 솔리드커넥션. 교환학생 커뮤니티에서 학교 검색, 성적 입력, 지원 현황 확인까지 한 번에. 교환학생 준비를 위한 모든 정보를 제공합니다.",
  alternates: {
    canonical: `${baseUrl}/`,
  },
  openGraph: {
    title: "교환학생 사이트 | 솔리드 커넥션 – 교환학생 커뮤니티",
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
    title: "교환학생 사이트 | 솔리드 커넥션 – 교환학생 커뮤니티",
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

const HomePage = async () => {
  const newsList = await fetchAllNews();
  const recommendedUniversitiesResponse = await getRecommendedUniversity();

  // 빌드 시 필수 데이터 검증
  if (!recommendedUniversitiesResponse.ok) {
    throw new Error("Failed to fetch recommended universities for home page");
  }

  const recommendedUniversities = recommendedUniversitiesResponse.data.recommendedUniversities;

  // 권역별 전체 대학 리스트를 미리 가져와 빌드합니다
  const allRegionsUniversityList = await getCategorizedUniversities();

  if (!allRegionsUniversityList || Object.keys(allRegionsUniversityList).length === 0) {
    throw new Error("Failed to fetch categorized universities for home page");
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="w-full">
        <FindLastYearScoreBar />
        <div className="flex flex-col gap-2.5 px-5 py-3.5">
          <div className="flex gap-2">
            <Link
              className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-bg-accent-blue p-2.5"
              href="/university/search"
            >
              <div className="flex flex-col">
                <span className="text-secondary typo-bold-5">학교 검색하기</span>
                <span className="text-k-700 typo-medium-4">모든 학교 목록을 확인해보세요</span>
              </div>
              <div className="flex justify-end">
                <IconMagnifyingGlass />
              </div>
            </Link>
            <Link
              className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-bg-accent-sky p-2.5"
              href="/university/score"
            >
              <div className="flex flex-col">
                <span className="text-sub-a typo-bold-5">성적 입력하기</span>
                <span className="text-k-700 typo-medium-4">성적을 입력해보세요</span>
              </div>
              <div className="flex justify-end">
                <IconPaper />
              </div>
            </Link>
          </div>
          <div className="flex gap-2">
            <Link
              className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-bg-accent-orange p-2.5"
              href="/university/application/apply"
            >
              <div className="flex flex-col">
                <span className="text-accent-custom-orange typo-bold-5">학교 지원하기</span>
                <span className="text-k-700 typo-medium-4">학교를 지원해주세요</span>
              </div>
              <div className="flex justify-end">
                <IconMuseum />
              </div>
            </Link>
            <Link
              className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-bg-accent-green p-2.5"
              href="/university/application"
            >
              <div className="flex flex-col">
                <span className="text-accent-custom-green typo-bold-5">지원자 현황 확인</span>
                <span className="text-k-700 typo-medium-4">경쟁률을 바로 분석해드려요</span>
              </div>
              <div className="flex justify-end">
                <IconIdCard />
              </div>
            </Link>
          </div>
        </div>

        <div className="border-t-[5px] border-k-50 py-5 pl-5">
          <div className="mb-2 flex items-center gap-1.5 font-serif text-k-700 typo-sb-7">실시간 인기있는 파견학교</div>
          <PopularUniversitySection universities={recommendedUniversities} />
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

export const revalidate = 60 * 60 * 24; // 1 day

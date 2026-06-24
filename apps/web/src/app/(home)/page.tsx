import type { Metadata } from "next";
import { getHomeNewsList } from "@/apis/news/server/getNewsList";
import { getCategorizedUniversities, getRecommendedUniversity } from "@/apis/universities/server";
import { getHomeUniversitySlugByName } from "@/constants/university";
import { type ListUniversity, RegionEnumExtend } from "@/types/university";
import { createUrl } from "@/utils/seo";
import HomeResponsiveContent from "./_ui/HomeResponsiveContent";

const pageUrl = createUrl("/");
const ogImageUrl = createUrl("/opengraph-image.png");
const homeMetaTitle = "교환학생 사이트 | 솔리드 커넥션 – 교환학생 커뮤니티, 플랫폼";

export const metadata: Metadata = {
  title: homeMetaTitle,
  description:
    "교환학생 사이트 솔리드커넥션. 교환학생 커뮤니티에서 학교 검색, 성적 입력, 지원 현황 확인까지 한 번에. 교환학생 준비를 위한 모든 정보를 제공합니다.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: homeMetaTitle,
    description:
      "교환학생 사이트 솔리드커넥션. 교환학생 커뮤니티에서 학교 검색, 성적 입력, 지원 현황 확인까지 한 번에. 교환학생 준비를 위한 모든 정보를 제공합니다.",
    url: pageUrl,
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
  url: pageUrl,
  description: "교환학생 학교 검색, 성적 입력, 지원 현황 확인까지 가능한 교환학생 플랫폼.",
};

const resolveRecommendedUniversitiesHomeUniversityName = (
  recommendedUniversities: ListUniversity[],
  allUniversities: ListUniversity[],
) => {
  const homeUniversityNameById = new Map(
    allUniversities.map((university) => [university.id, university.homeUniversityName]),
  );
  const homeUniversityNamesByTermAndName = new Map<string, Set<ListUniversity["homeUniversityName"]>>();

  allUniversities.forEach((university) => {
    const key = `${university.term}:${university.koreanName}`;
    const names = homeUniversityNamesByTermAndName.get(key) ?? new Set<ListUniversity["homeUniversityName"]>();

    names.add(university.homeUniversityName);
    homeUniversityNamesByTermAndName.set(key, names);
  });

  return recommendedUniversities.map((university) => ({
    ...university,
    homeUniversityName:
      university.homeUniversityName ??
      homeUniversityNameById.get(university.id) ??
      getUniqueHomeUniversityName(homeUniversityNamesByTermAndName, university),
  }));
};

const getUniqueHomeUniversityName = (
  homeUniversityNamesByTermAndName: Map<string, Set<ListUniversity["homeUniversityName"]>>,
  university: ListUniversity,
) => {
  const names = homeUniversityNamesByTermAndName.get(`${university.term}:${university.koreanName}`);

  if (!names || names.size !== 1) {
    return undefined;
  }

  return names.values().next().value;
};

const hasUniversityDetailRoute = (university: ListUniversity) => {
  return getHomeUniversitySlugByName(university.homeUniversityName) !== undefined;
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
  ).filter(hasUniversityDetailRoute);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HomeResponsiveContent
        recommendedUniversities={resolvedRecommendedUniversities}
        allRegionsUniversityList={allRegionsUniversityList}
        newsList={newsList}
      />
    </>
  );
};

export default HomePage;

export const revalidate = 86400; // 1 day

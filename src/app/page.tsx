import { Metadata } from "next";
import Script from "next/script";

import TopLogoBar from "@/components/ui/TopLogoBar";

import Home from "./_home";

import { News } from "@/types/news";

import getRecommendedColleges from "@/api/university/server/getRecommendedUniversity";
import { fetchAllNews } from "@/lib/firebaseNews";

// 동적 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  // 최신 뉴스 및 추천 대학 정보를 서버에서 가져옵니다.
  const newsList: News[] = await fetchAllNews();
  const { data } = await getRecommendedColleges();
  const universities = data?.recommendedUniversities ?? [];

  // 대표 뉴스(첫 번째 항목)를 선택해 OG 이미지 등에 활용
  const mainNews = newsList[0];

  // 추천 대학 한글명을 최대 10개까지 keywords로 사용
  const keywords = universities
    .slice(0, 10)
    .map((u) => u.koreanName)
    .join(", ");

  return {
    title: "솔리드 커넥션 – 교환학생의 첫 걸음",
    description: mainNews?.description ?? "교환학생 준비를 위한 모든 정보가 여기에!",
    keywords,
    alternates: {
      canonical: "https://solid-connection.com/",
    },
  };
}

const HomePage = async () => {
  return (
    <>
      <Head />
      <TopLogoBar />
      <Home />
    </>
  );
};

export default HomePage;

export const revalidate = 60 * 60 * 24; // 1 day

// src/app/head.tsx
const Head = async () => {
  const newsList: News[] = await fetchAllNews();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: newsList.slice(0, 3).map((n, idx) => ({
      "@type": "NewsArticle",
      position: idx + 1,
      headline: n.title,
      description: n.description,
      url: n.url,
      image: n.imageUrl,
    })),
  };
  return (
    <Script
      id="ld-json-homepage"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
};

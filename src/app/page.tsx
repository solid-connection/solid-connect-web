import { Metadata } from "next";

import TopLogoBar from "@/components/ui/TopLogoBar";

import Home from "./_home";
import Head from "./_home/Head";

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
  const newsList = await fetchAllNews();
  return (
    <>
      <Head newsList={newsList} />
      <TopLogoBar />
      <Home />
    </>
  );
};

export default HomePage;

export const revalidate = 60 * 60 * 24; // 1 day

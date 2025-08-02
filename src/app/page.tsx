import { Metadata } from "next";

import TopLogoBar from "@/components/ui/TopLogoBar";

import Home from "./_home";

import { News } from "@/types/news";

import { fetchAllNews } from "@/lib/firebaseNews";

// 동적 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  // 최신 뉴스 정보를 서버에서 가져옵니다.
  const newsList: News[] = await fetchAllNews();

  // 대표 뉴스(첫 번째 항목)를 선택해 OG 이미지 등에 활용
  const mainNews = newsList[0];

  return {
    title: "솔리드 커넥션 – 교환학생의 첫 걸음",
    description: mainNews?.description ?? "교환학생 준비를 위한 모든 정보가 여기에!",
    alternates: {
      canonical: "https://solid-connection.com/",
    },
  };
}

const HomePage = async () => {
  return (
    <>
      <TopLogoBar />
      <Home />
    </>
  );
};

export default HomePage;

export const revalidate = 60 * 60 * 24; // 1 day

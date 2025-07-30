import { Metadata } from "next";

import TopLogoBar from "@/components/layout/TopLogoBar";

import Home from "./Home";

import { News } from "@/types/news";

import { fetchAllNews } from "@/lib/firebaseNews";

export const metadata: Metadata = {
  title: "솔리드 커넥션",
  description: "솔리드 커넥션. 교환학생의 첫 걸음",
};

const HomePage = async () => {
  // Fetch newsList on the server side
  const newsListResponse = await fetchAllNews();
  const newsList: News[] = newsListResponse;

  return (
    <div>
      <TopLogoBar />
      <Home newsList={newsList} />
    </div>
  );
};

export default HomePage;

export const revalidate = 3600; // 1 hour

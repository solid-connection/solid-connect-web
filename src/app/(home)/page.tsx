import { Metadata } from "next";

import TopLogoBar from "@/components/ui/TopLogoBar";

import Home from ".";

export const metadata: Metadata = {
  title: "솔리드 커넥션 – 교환학생의 첫 걸음",
  description: "교환학생 준비를 위한 모든 정보가 여기에!",
  alternates: {
    canonical: "https://solid-connection.com/",
  },
};

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

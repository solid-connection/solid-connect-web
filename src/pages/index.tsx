import Head from "next/head";
import createApiClient from "@/lib/serverApiClient";
import { getRecommendedCollegesData } from "./api/college/recommended";
import { getNewsList } from "./api/news";

import TopNavigation from "@/components/layout/top-navigation";
import Home from "@/components/home/home";

interface college {
  id: number;
  koreanName: string;
  backgroundImgUrl: string;
}

interface news {
  id: number;
  title: string;
  imageUrl: string;
  url: string;
}

export default function HomePage({ recommendedColleges, newsList }: { recommendedColleges: college[]; newsList: news[] }) {
  return (
    <div>
      <Head>
        <title>솔리드 커넥션</title>
      </Head>
      <TopNavigation />
      <Home recommendedColleges={recommendedColleges} newsList={newsList} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;

  // 추천 대학
  let recommendedColleges = [];
  try {
    const apiClient = createApiClient(req, res);
    const reponse = await apiClient.get("/home");
    recommendedColleges = reponse.data.data.recommendedUniversities;
  } catch (error) {
    const reponse = await getRecommendedCollegesData();
    recommendedColleges = reponse.data.data.recommendedUniversities;
  }

  // 소식지
  const newsListReponse = await getNewsList();
  const newsList = newsListReponse.data;

  return {
    props: { recommendedColleges, newsList },
  };
}

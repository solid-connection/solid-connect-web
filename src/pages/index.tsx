import Head from "next/head";
import { useEffect, useState } from "react";

import { getRecommendedUniversitiesApi } from "@/services/university";

import Home from "@/components/home/home";
import TopNavigation from "@/components/layout/top-navigation";

import { News } from "@/types/news";
import { ListUniversity } from "@/types/university";

import { getNewsList } from "@/pages/api/news";

type HomePageProps = {
  newsList: News[];
};

export default function HomePage({ newsList }: HomePageProps) {
  const [recommendedColleges, setRecommendedColleges] = useState<ListUniversity[]>([]);

  useEffect(() => {
    async function fetchRecommendedColleges() {
      try {
        const response = await getRecommendedUniversitiesApi();
        setRecommendedColleges(response.data.recommendedUniversities);
        // eslint-disable-next-line
      } catch (error) {
        setRecommendedColleges([]);
      }
    }

    // if (isAuthenticated()) {
    fetchRecommendedColleges();
    // }
  }, []);

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

export async function getServerSideProps() {
  // 소식지
  const newsListReponse = await getNewsList();
  const newsList = newsListReponse.data;

  return {
    props: { newsList },
  };
}

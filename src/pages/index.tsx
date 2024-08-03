import Head from "next/head";
import { useEffect, useState } from "react";

import { getMyApplicationStatusApi } from "@/services/application";
import { getRecommendedUniversitiesApi } from "@/services/university";
import { isAuthenticated } from "@/utils/authUtils";

import Home from "@/components/home/home";
import TopNavigation from "@/components/layout/top-navigation";

import { ApplyStatus } from "@/types/application";
import { News } from "@/types/news";
import { ListUniversity } from "@/types/university";

import { getNewsList } from "@/pages/api/news";

export default function HomePage(props: { newsList: News[] }) {
  const [recommendedColleges, setRecommendedColleges] = useState<ListUniversity[]>([]);
  const [applyStatus, setApplyStatus] = useState<ApplyStatus | null>(null);

  useEffect(() => {
    async function fetchRecommendedColleges() {
      try {
        const response = await getRecommendedUniversitiesApi();
        setRecommendedColleges(response.data.recommendedUniversities);
      } catch (error) {
        setRecommendedColleges([]);
      }
    }

    async function fetchApplyStatus() {
      await getMyApplicationStatusApi()
        .then((res) => {
          setApplyStatus(res.data.status);
        })
        .catch((err) => {
          // 오류 발생 시 비로그인 상태
          setApplyStatus("NO_AUTHORIZATION");
        });
    }

    // if (isAuthenticated()) {
    fetchRecommendedColleges();
    fetchApplyStatus();
    // }
  }, []);

  return (
    <div>
      <Head>
        <title>솔리드 커넥션</title>
      </Head>
      <TopNavigation />
      <Home recommendedColleges={recommendedColleges} newsList={props.newsList} applyStatus={applyStatus} />
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

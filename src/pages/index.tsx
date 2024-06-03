import { useState, useEffect } from "react";
import Head from "next/head";
import apiClient from "@/utils/axiosClient";

import { getRecommendedCollegesData } from "./api/college/recommended";
import { getNewsList } from "./api/news";
import { SimpleCollege } from "@/types/college";
import { News } from "@/types/news";
import { ApplyStatus } from "@/types/application";

import TopNavigation from "@/components/layout/top-navigation";
import Home from "@/components/home/home";
import { getMyApplicationStatusApi } from "@/services/application";

export default function HomePage(props: { newsList: News[] }) {
  let isLogin: boolean = false;
  const [recommendedColleges, setRecommendedColleges] = useState<SimpleCollege[]>([]);
  const [applyStatus, setApplyStatus] = useState<ApplyStatus | null>(null);

  useEffect(() => {
    if (localStorage.getItem("refreshToken") !== null) isLogin = true;

    async function fetchRecommendedColleges() {
      try {
        const response = await apiClient.get("/home");
        const recommendedCollegesData = response.data.data.recommendedUniversities;
        setRecommendedColleges(recommendedCollegesData);
      } catch (error) {
        console.error("개인 추천 파견학교를 불러오는데 실패했습니다");
        try {
          const response = await getRecommendedCollegesData();
          const recommendedCollegesData = response.data.recommendedUniversities;
          setRecommendedColleges(recommendedCollegesData);
        } catch (error) {
          console.error("추천 파견학교를 불러오는데 실패했습니다");
        }
      }
    }

    async function fetchApplyStatus() {
      await getMyApplicationStatusApi()
        .then((res) => {
          if (res.data.success === false) throw new Error(res.data.error.message);
          setApplyStatus(res.data.data.status);
        })
        .catch((err) => {
          // 오류 발생 시 비로그인 상태
          setApplyStatus("NO_AUTHORIZATION");
        });
    }

    if (isLogin) {
      fetchRecommendedColleges();
      fetchApplyStatus();
    }
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

import { News, SimpleCollege } from "@/types/college";
import { ApplyStatus } from "@/types/application";
import { useState, useEffect } from "react";
import Head from "next/head";
import createServerApiClient from "@/lib/serverApiClient";
import createClientApiClient from "@/lib/clientApiClient";
import { getRecommendedCollegesData } from "./api/college/recommended";
import { getNewsList } from "./api/news";

import TopNavigation from "@/components/layout/top-navigation";
import Home from "@/components/home/home";

export default function HomePage({ recommendedColleges, newsList }: { recommendedColleges: SimpleCollege[]; newsList: News[]; applyStatus: ApplyStatus }) {
  const apiClient = createClientApiClient();
  const [applyStatus, setApplyStatus] = useState<ApplyStatus>("NO_AUTHORIZATION");

  useEffect(() => {
    async function fetchApplyStatus() {
      try {
        const response = await apiClient.get("/application/status");
        const statusData = response.data.data;
        setApplyStatus(statusData.status);
      } catch (error) {
        // 비로그인 상태
        setApplyStatus("NO_AUTHORIZATION");
      }
    }
    fetchApplyStatus();
  }, []);

  return (
    <div>
      <Head>
        <title>솔리드 커넥션</title>
      </Head>
      <TopNavigation />
      <Home recommendedColleges={recommendedColleges} newsList={newsList} applyStatus={applyStatus} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const apiClient = createServerApiClient(req, res);

  // 추천 대학
  let recommendedColleges = [];
  try {
    try {
      const reponse = await apiClient.get("/home");
      recommendedColleges = reponse.data.data.recommendedUniversities;
    } catch (error) {
      // cors등 문제시 서버에서 직접 호출
      const reponse = await getRecommendedCollegesData();
      recommendedColleges = reponse.data.recommendedUniversities;
    }
  } catch (error) {
    recommendedColleges = [];
  }

  // 소식지
  const newsListReponse = await getNewsList();
  const newsList = newsListReponse.data;

  // 지원 상태
  let applyStatus: ApplyStatus = "NO_AUTHORIZATION";
  try {
    const statusResponse = await apiClient.get("/application/status");
    const statusData = statusResponse.data.data;
    applyStatus = statusData.status;
  } catch (error) {
    // 비로그인 상태
    applyStatus = "NO_AUTHORIZATION";
  }

  return {
    props: { recommendedColleges, newsList, applyStatus },
  };
}

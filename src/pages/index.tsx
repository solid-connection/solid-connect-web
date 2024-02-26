import { useState, useEffect } from "react";
import Head from "next/head";
import createServerApiClient from "@/lib/serverApiClient";
import createClientApiClient from "@/lib/clientApiClient";
import Cookies from "js-cookie";

import { getRecommendedCollegesData } from "./api/college/recommended";
import { getNewsList } from "./api/news";
import { News, CardCollege, SimpleCollege } from "@/types/college";
import { ApplyStatus } from "@/types/application";

import TopNavigation from "@/components/layout/top-navigation";
import Home from "@/components/home/home";

export default function HomePage(props: { recommendedColleges: CardCollege[]; newsList: News[] }) {
  const isLogin = Cookies.get("refreshToken") ? true : false;
  const apiClient = createClientApiClient();
  const [recommendedColleges, setRecommendedColleges] = useState<SimpleCollege[]>(props.recommendedColleges);
  const [applyStatus, setApplyStatus] = useState<ApplyStatus | null>(null);

  useEffect(() => {
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
      try {
        const response = await apiClient.get("/application/status");
        const statusData = response.data.data;
        setApplyStatus(statusData.status);
      } catch (error) {
        // 비로그인 상태
        setApplyStatus("NO_AUTHORIZATION");
      }
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

export async function getServerSideProps(context) {
  const { req, res } = context;
  const apiClient = createServerApiClient(req, res);
  const isLogin = req.cookies.refreshToken ? true : false;

  // 추천 대학
  let recommendedColleges: SimpleCollege[] = [];
  if (!isLogin) {
    try {
      const reponse = await getRecommendedCollegesData();
      recommendedColleges = reponse.data.recommendedUniversities;
    } catch (error) {
      console.error("추천 파견학교를 불러오는데 실패했습니다");
    }
  }

  // 소식지
  const newsListReponse = await getNewsList();
  const newsList = newsListReponse.data;

  // 지원 상태
  // let applyStatus: ApplyStatus = "NO_AUTHORIZATION";
  // try {
  //   const statusResponse = await apiClient.get("/application/status");
  //   const statusData = statusResponse.data.data;
  //   applyStatus = statusData.status;
  // } catch (error) {
  //   // 비로그인 상태
  //   applyStatus = "NO_AUTHORIZATION";
  // }

  return {
    props: { recommendedColleges, newsList },
  };
}

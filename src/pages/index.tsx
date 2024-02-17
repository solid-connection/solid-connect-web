import Head from "next/head";
import createApiClient from "@/lib/serverApiClient";
import { getRecommendedCollegesData } from "./api/college/recommended";
import { getNewsList } from "./api/news";
import { ApplyStatus } from "@/types/application";

import TopNavigation from "@/components/layout/top-navigation";
import Home from "@/components/home/home";
import { News, SimpleCollege } from "@/types/college";

export default function HomePage({ recommendedColleges, newsList, applyStatus }: { recommendedColleges: SimpleCollege[]; newsList: News[]; applyStatus: ApplyStatus }) {
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
  const apiClient = createApiClient(req, res);

  // 추천 대학
  let recommendedColleges = [];
  try {
    const reponse = await apiClient.get("/home");
    recommendedColleges = reponse.data.data.recommendedUniversities;
  } catch (error) {
    const reponse = await getRecommendedCollegesData();
    recommendedColleges = reponse.data.recommendedUniversities;
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

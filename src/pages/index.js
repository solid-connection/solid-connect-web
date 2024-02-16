import Head from "next/head";
import createApiClient from "@/lib/serverApiClient";

import TopNavigation from "@/components/layout/top-navigation";
import Home from "@/components/home/home";

import { getRecommendedCollegesData } from "./api/college/recommended";

export default function HomePage(props) {
  const { recommendedColleges, newsList } = props;

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
  let recommendedColleges = [];
  try {
    const apiClient = createApiClient(req, res);
    const reponse = await apiClient.get("/home");
    recommendedColleges = reponse.data.data.recommendedUniversities;
  } catch (error) {
    const data = await getRecommendedCollegesData();
    recommendedColleges = data.recommendedUniversities;
  }

  const newsList = [{ id: 1, imageUrl: "/images/news/1.jpeg", url: "https://blog.naver.com/yoon144950/223349958663", title: "교환학생 해외 대학 학점 인정은 어떻게 받아요?" }];
  return {
    props: { recommendedColleges: recommendedColleges, newsList: newsList },
  };
}

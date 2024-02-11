import Head from "next/head";

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
  // const recommendedCollegeIds = [99, 67, 80, 8, 130, 5];
  // const recommendedColleges = await Promise.all(recommendedCollegeIds.map((id) => getCollegeDetailData(id)));
  const data = await getRecommendedCollegesData();
  const recommendedColleges = data.recommendedUniversities;
  const newsList = [{ id: 1, imageUrl: "/news/1.jpeg", title: "교환학생 해외 대학 학점 인정은 어떻게 받아요?" }];
  return {
    props: { recommendedColleges: recommendedColleges, newsList: newsList },
  };
}

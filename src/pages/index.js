import Head from "next/head";

import TopNavigation from "@/components/layout/top-navigation";
import Home from "@/components/home/home";

import { Inter } from "next/font/google";
import { getCollegeDetailData } from "./api/college/[id]";

const inter = Inter({ subsets: ["latin"] });

export default function HomePage(props) {
  const { recommendedColleges } = props;

  return (
    <div>
      <Head>
        <title>솔리드 커넥션</title>
      </Head>
      <TopNavigation />
      <Home recommendedColleges={recommendedColleges} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const recommendedCollegeIds = [99, 67, 80, 8, 130, 5];
  const recommendedColleges = await Promise.all(recommendedCollegeIds.map((id) => getCollegeDetailData(id)));
  return {
    props: { recommendedColleges: recommendedColleges },
  };
}

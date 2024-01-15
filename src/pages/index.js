import Head from "next/head";
import { useState } from "react";

import TopNavigation from "@/components/layout/top-navigation";
import Home from "@/components/home/home";

import { Inter } from "next/font/google";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import { getCollegeDetailData } from "./api/college/[id]";

const inter = Inter({ subsets: ["latin"] });

export default function HomePage(props) {
  const { recommendedColleges } = props;
  const [isSearch, setIsSearch] = useState(false);

  return (
    <div>
      <Head>
        <title>솔리드 커넥션</title>
      </Head>

      {!isSearch ? <TopNavigation /> : <TopDetailNavigation title="키워드 검색" />}

      <Home setIsSearch={setIsSearch} recommendedColleges={recommendedColleges} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const recommendedCollegeIds = [99, 67, 80, 8, 130, 5];
  const recommendedColleges = await Promise.all(recommendedCollegeIds.map((id) => getCollegeDetailData(id)));
  console.log(recommendedColleges);
  return {
    props: { recommendedColleges: recommendedColleges },
  };
}

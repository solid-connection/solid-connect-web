import Head from "next/head";
import apiClient from "@/lib/axiosClient";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyStatus from "@/components/my/my-status";
import MyProfile from "@/components/my/my-profile";
import MyMenu from "@/components/my/my-menu";
import { useEffect, useState } from "react";

export default function MyPage() {
  const [myData, setMyData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get("/my-page"); // Interceptors handle the auth headers
        console.log("my response: ", response);
        setMyData(response.data.data);
      } catch (err) {
        console.error("my error", err);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>마이페이지</title>
      </Head>
      <TopDetailNavigation title="마이페이지" />
      <MyProfile {...myData} />
      {/* <MyStatus scrapCount={myData.likedPostCount || 0} mentoCount={myData.likedMentoCount || 0} wishCollegeCount={myData.likedUnivCount || 0} /> */}
      <MyMenu />
    </>
  );
}

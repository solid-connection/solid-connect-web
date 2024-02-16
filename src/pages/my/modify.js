import Head from "next/head";
import { useState, useEffect } from "react";
import createApiClient from "@/lib/clientApiClient";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyModify from "@/components/my/my-modify";

export default function MyModifyPage(props) {
  const [myData, setMyData] = useState(null);
  const apiClient = createApiClient();
  useEffect(() => {
    async function fetchData() {
      const res = await apiClient.get("/my-page");
      const { data } = res.data;
      setMyData(data);
    }
    fetchData();
  }, []);
  return (
    <>
      <Head>
        <title>프로필 수정</title>
      </Head>
      <TopDetailNavigation title="프로필 수정" />
      <MyModify {...myData} />
    </>
  );
}

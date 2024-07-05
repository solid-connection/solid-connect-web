import { useState, useEffect } from "react";
import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ScrollTab from "@/components/ui/scroll-tab";
import CollegeCards from "@/components/college/list/college-cards";
import { useGetMyWishUniversity } from "@/services/myInfo";

export default function MyScrapPage() {
  const [data, error, loading] = useGetMyWishUniversity();

  // TODO: 이후 업데이트 기능
  // const tabs = ["스크랩 한 글", "멘토", "위시학교"];
  const tabs = ["위시학교"];
  const [tab, setTab] = useState(tabs[0]);

  useEffect(() => {
    if (!loading) {
      if (error) {
        if (error.response) {
          console.error("Axios response error", error.response.data);
          alert(error.response.data?.error?.message);
        } else if (error.reqeust) {
          console.error("Axios request error", error.request);
        } else {
          console.error("Error", error.message);
          alert(error.message);
        }
      }
    }
  }, [data, error, loading]);

  return (
    <>
      <Head>
        <title>즐거찾기</title>
      </Head>
      <TopDetailNavigation title="즐거찾기" />
      <ScrollTab choices={tabs} choice={tab} setChoice={setTab} />
      {loading || <CollegeCards colleges={data.data} style={{ marginTop: "20px" }} />}
    </>
  );
}

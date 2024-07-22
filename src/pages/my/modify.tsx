import Head from "next/head";
import { useEffect, useState } from "react";

import { getMyInfoApi } from "@/services/myInfo";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyModify from "@/components/my/my-modify";

export default function MyModifyPage() {
  const [myData, setMyData] = useState(null);

  useEffect(() => {
    const fetchMyData = async () => {
      await getMyInfoApi()
        .then((res) => {
          setMyData(res.data);
        })
        .catch((err) => {
          if (err.response) {
            console.error("Axios response error", err.response.data);
            alert(err.response.data?.error?.message);
          } else if (err.reqeust) {
            console.error("Axios request error", err.request);
          } else {
            console.error("Error", err.message);
            alert(err.message);
          }
        });
    };
    fetchMyData();
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

import Head from "next/head";
import { useState, useEffect } from "react";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyModify from "@/components/my/my-modify";
import { getMyInfoApi } from "@/services/myInfo";

export default function MyModifyPage() {
  const [myData, setMyData] = useState(null);

  useEffect(() => {
    const fetchMyData = async () => {
      await getMyInfoApi()
        .then((res) => {
          if (res.data.success === false) throw new Error(res.data.error.message);
          setMyData(res.data.data);
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

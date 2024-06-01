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
        .catch((error) => {
          if (error.response) {
            console.error(error.response.data);
            alert(error.response.data);
          } else if (error.request) {
            console.error(error.request);
          } else {
            console.error(error.message);
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

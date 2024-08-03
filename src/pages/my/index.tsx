import Head from "next/head";
import { useEffect, useState } from "react";

import { getMyInfoApi } from "@/services/myInfo";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyMenu from "@/components/my/my-menu";
import MyProfile from "@/components/my/my-profile";

export default function MyPage() {
  const [myData, setMyData] = useState(null);

  useEffect(() => {
    const fetchMyData = async () => {
      await getMyInfoApi()
        .then((res) => {
          setMyData(res.data);
        })
        .catch((err) => {
          if (err.response) {
            console.error("Axios response error", err.response);
            alert(err.response.data?.message);
          } else if (err.reqeust) {
            console.error("Axios request error", err.request);
          } else {
            console.error("Error", err.message);
            alert(err.message);
          }
          document.location.href = "/login"; // 로그인 페이지로 이동
        });
    };
    fetchMyData();
  }, []);

  if (!myData) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>마이페이지</title>
      </Head>
      <TopDetailNavigation title="마이페이지" />
      <MyProfile {...myData} />
      <MyMenu />
    </>
  );
}

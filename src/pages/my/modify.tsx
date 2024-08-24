import Head from "next/head";
import { useEffect, useState } from "react";

import { getMyInfoApi } from "@/services/myInfo";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyModify from "@/components/my/my-modify";

import { MyInfo } from "@/types/myInfo";

export default function MyModifyPage() {
  const [myData, setMyData] = useState<MyInfo>(null);

  useEffect(() => {
    const fetchMyData = async () => {
      await getMyInfoApi()
        .then((res) => {
          setMyData(res.data);
        })
        .catch((err) => {
          if (err.response) {
            console.error("Axios response error", err.response);
            if (err.response.status === 401 || err.response.status === 403) {
              alert("로그인이 필요합니다");
              document.location.href = "/login";
            } else {
              alert(err.response.data?.message);
            }
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
        <title>프로필 수정</title>
      </Head>
      <TopDetailNavigation title="프로필 수정" />
      <MyModify myInfo={myData} />
    </>
  );
}

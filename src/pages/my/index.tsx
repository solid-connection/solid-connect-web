import Head from "next/head";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyStatus from "@/components/my/my-status";
import MyProfile from "@/components/my/my-profile";
import MyMenu from "@/components/my/my-menu";
import { useEffect, useState } from "react";
import { getMyInfoApi } from "@/services/myInfo";

export default function MyPage() {
  const [myData, setMyData] = useState(null);

  useEffect(() => {
    const fetchMyData = async () => {
      await getMyInfoApi()
        .then((res) => {
          if (res.data.success == false) throw new Error(res.data.error.message);
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
        <title>마이페이지</title>
      </Head>
      <TopDetailNavigation title="마이페이지" />
      <MyProfile {...myData} />
      {/* <MyStatus scrapCount={myData.likedPostCount || 0} mentoCount={myData.likedMentoCount || 0} wishCollegeCount={myData.likedUnivCount || 0} /> */}
      <MyMenu />
    </>
  );
}

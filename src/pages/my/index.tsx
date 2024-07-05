import Head from "next/head";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyProfile from "@/components/my/my-profile";
import MyMenu from "@/components/my/my-menu";
import { useEffect } from "react";
import { useGetMyInfo } from "@/services/myInfo";

export default function MyPage() {
  const [data, error, loading] = useGetMyInfo();

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
        <title>마이페이지</title>
      </Head>
      <TopDetailNavigation title="마이페이지" />
      {loading || <MyProfile {...data.data} />}
      {/* <MyStatus scrapCount={myData.likedPostCount || 0} mentoCount={myData.likedMentoCount || 0} wishCollegeCount={myData.likedUnivCount || 0} /> */}
      <MyMenu />
    </>
  );
}

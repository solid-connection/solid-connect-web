import Head from "next/head";

// import { getUserData } from "@/pages/api/user";
import { getMyData } from "@/pages/api/my";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyStatus from "@/components/my/my-status";
import MyProfile from "@/components/my/my-profile";
import MyMenu from "@/components/my/my-menu";

export default function MyPage(props) {
  const { myData } = props;

  return (
    <>
      <Head>
        <title>마이페이지</title>
      </Head>
      <TopDetailNavigation title="마이페이지" />
      <MyProfile {...myData} />
      <MyStatus scrapCount={myData.likedPostCount || 0} mentoCount={myData.likedMentoCount || 0} wishCollegeCount={myData.likedUnivCount || 0} />
      <MyMenu />
    </>
  );
}

export async function getServerSideProps(context) {
  // 요청에서 쿠키를 추출합니다.
  const { req } = context;
  const accessToken = req.cookies["accessToken"];

  // 토큰 유효성 검사 로직 (예제 코드)
  const isLogin = accessToken ? true : false; // 실제로는 토큰의 유효성을 검증하는 로직이 필요합니다.

  if (!isLogin) {
    // 비로그인 상태일 경우 로그인 페이지로 리다이렉트
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const myData = await getMyData(accessToken);

  return {
    props: { myData: myData },
  };
}

import Head from "next/head";
import { useRouter } from "next/router";
import { getUserData } from "@/pages/api/user";
// import { useSession } from "next-auth/react";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyStatus from "@/components/my/my-status";
import MyProfile from "@/components/my/my-profile";
import MyMenu from "@/components/my/my-menu";

export default function MyPage(props) {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   // 로그인 상태가 아니라면 /login 페이지로 리다이렉트
  //   if (status === "unauthenticated") {
  //     router.push("/login");
  //   }
  // }, [status, router]);

  // 로딩 상태 처리 (선택적)
  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  // 로그인 상태일 때만 마이페이지 내용 표시

  const { userData } = props;

  return (
    <>
      <Head>
        <title>마이페이지</title>
      </Head>
      <TopDetailNavigation title="마이페이지" />
      <MyProfile {...userData} />
      <MyStatus scrapCount={userData.likedPostCount} mentoCount={userData.likedMentoCount} wishCollegeCount={userData.likedUnivCount} />
      <MyMenu />
    </>
  );
}

export async function getServerSideProps(context) {
  // 요청에서 쿠키를 추출합니다.
  const { req } = context;
  const token = req.cookies["accessToken"];

  // 토큰 유효성 검사 로직 (예제 코드)
  // const isValid = token ? true : false; // 실제로는 토큰의 유효성을 검증하는 로직이 필요합니다.
  const isValid = true;

  if (!isValid) {
    // 비로그인 상태일 경우 로그인 페이지로 리다이렉트
    return {
      redirect: {
        destination: "/login/kakao",
        permanent: false,
      },
    };
  }

  const userData = await getUserData(token);

  if (!userData) {
    // 유저 데이터를 가져오지 못했을 경우 500 에러를 반환합니다.
    return {
      props: {},
      notFound: true,
    };
  }

  return {
    props: { userData: userData },
  };
}

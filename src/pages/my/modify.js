import Head from "next/head";

import { getMyData } from "@/pages/api/my";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyModify from "@/components/my/my-modify";

export default function MyModifyPage(props) {
  const { myData } = props;
  const userData = {
    name: "김솔커",
    image: "/images/catolic.png",
    role: "멘티",
    gender: "여자",
    birthDate: "2000.09.09",
    originCollege: "인하대학교",
    exchangeCollege: "보라스대학교",
  };

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

export async function getServerSideProps(context) {
  // 요청에서 쿠키를 추출합니다.
  const { req } = context;
  const accessToken = req.cookies["accessToken"];

  // 토큰 유효성 검사 로직 (예제 코드)
  const isValid = accessToken ? true : false; // 실제로는 토큰의 유효성을 검증하는 로직이 필요합니다.

  if (!isValid) {
    // 비로그인 상태일 경우 로그인 페이지로 리다이렉트
    return {
      redirect: {
        destination: "/login/kakao",
        permanent: false,
      },
    };
  }

  const myData = await getMyData(accessToken);

  return {
    props: { myData: myData },
  };
}

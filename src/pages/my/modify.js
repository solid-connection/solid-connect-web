import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyModify from "@/components/my/my-modify";

export default function MyModifyPage() {
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
      <MyModify {...userData} />
    </>
  );
}

import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import PostWriteForm from "@/components/community/post-write/post-write-form";

export default function PostCreatePage() {
  return (
    <>
      <Head>
        <title>글쓰기</title>
      </Head>
      <TopDetailNavigation title="글쓰기" />
      <div>
        <PostWriteForm />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  // 요청에서 쿠키를 추출합니다.
  const { req } = context;
  const token = req.cookies["accessToken"];

  // 토큰 유효성 검사 로직 (예제 코드)
  const isLogin = token ? true : false; // 실제로는 토큰의 유효성을 검증하는 로직이 필요합니다.

  if (!isLogin) {
    // 비로그인 상태일 경우 로그인 페이지로 리다이렉트
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

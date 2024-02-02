import Head from "next/head";
import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyStatus from "@/components/my/my-status";

export default function MyPage() {
  // const { data: session, status } = useSession();
  const router = useRouter();

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
  return (
    <>
      <Head>
        <title>마이페이지</title>
      </Head>
      <TopDetailNavigation title="마이페이지" />
      <MyStatus />
    </>
  );
}

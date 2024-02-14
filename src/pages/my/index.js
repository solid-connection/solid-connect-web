import Head from "next/head";
import createApiClient from "@/lib/serverApiClient";

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
  const { req, res } = context;
  const apiClient = createApiClient(req, res);

  try {
    const response = await apiClient.get("/my-page"); // Interceptors handle the auth headers
    return { props: { myData: response.data.data } };
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

import Head from "next/head";

// import { getUserData } from "@/pages/api/user";
import { getMyData } from "@/pages/api/my";
// import { apiClient } from "@/lib/axios";
import axios from "axios";

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
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  });
  const { req, res } = context;
  try {
    let accessToken = req.cookies["accessToken"];

    let response = await apiClient.get("/my-page", {
      headers: { Authorization: `Bearer ${accessToken}`, withCredentials: true },
    });
    // console.log(response.data);

    return { props: { myData: response.data.data } };
  } catch (error) {
    // accessToken이 만료되거나 유효하지 않은 경우
    if (error.response && error.response.status === 403) {
      // Access token이 만료되었을 경우
      // 401 안뜨는듯?
      try {
        // Refresh token을 사용하여 새로운 Access token을 요청하는 로직
        const refreshToken = req.cookies["refreshToken"];
        const refreshResponse = await apiClient.post(
          "/auth/reissue",
          {},
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyaXBsYWMwMzE0QG5hdmVyLmNvbSIsImlhdCI6MTcwNzc4NDMxMywiZXhwIjoxNzA4Mzg5MTEzfQ.1H25zTZr6OqotcHzhh6yclY_SDXeXMw_g_68O4VVVbHv13hq7-5_wSBY2pEtimJaKglyvA61BuK6ZH3UYNO_Yg`,
              withCredentials: true,
            },
          }
        );
        const newAccessToken = refreshResponse.data.data.accessToken;

        // 새로운 Access token으로 다시 요청을 시도
        const response = await apiClient.get("/my-page", {
          headers: { Authorization: `Bearer ${newAccessToken}`, withCredentials: true },
        });

        res.setHeader("Set-Cookie", `accessToken=${newAccessToken}; Path=/; Max-Age=3600`);

        return { props: { myData: response.data.data } };
      } catch (refreshError) {
        console.error(refreshError);
        // Refresh token도 만료되었거나 유효하지 않은 경우 로그인 페이지로 리다이렉트
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }
    } else {
      console.error(error);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  }
}

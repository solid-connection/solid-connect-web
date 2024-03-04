import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLayout } from "@/context/LayoutContext";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME, ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "@/types/auth";

import SignupSurvey from "@/components/login/signup/signup-survey";

export default function KakaoLoginCallbackPage() {
  const { setHideBottomNavigation } = useLayout();
  useEffect(() => {
    setHideBottomNavigation(true);
    return () => setHideBottomNavigation(false); // 컴포넌트가 언마운트 될 때 다시 보이게 설정
  }, []);

  const router = useRouter();
  const [kakaoOauthToken, setkakaoOauthToken] = useState("");
  const [kakaoNickname, setkakaoNickname] = useState("");
  const [kakaoEmail, setkakaoEmail] = useState("");
  const [kakaoProfileImageUrl, setkakaoProfileImageUrl] = useState("");

  useEffect(() => {
    const code = router.query.code;
    if (code) {
      sendCodeToBackend(code);
    }
  }, [router.query.code]);

  const sendCodeToBackend = async (code) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/kakao`, { code }, { withCredentials: true, headers: { "Content-Type": "application/json" } });
      const data = await response.data;

      if (data.data.registered) {
        Cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.data.accessToken, { expires: ACCESS_TOKEN_EXPIRE_TIME, secure: true, sameSite: "strict" });
        Cookies.set(REFRESH_TOKEN_COOKIE_NAME, data.data.refreshToken, { expires: REFRESH_TOKEN_EXPIRE_TIME, secure: true, sameSite: "strict" });
        // 기존 회원일 시
        router.push("/");
      } else {
        // 새로운 회원일 시
        setkakaoOauthToken(data.data.kakaoOauthToken);
        setkakaoNickname(data.data.nickname);
        setkakaoEmail(data.data.email);
        setkakaoProfileImageUrl(data.data.profileImageUrl);
      }
    } catch (error) {
      console.log(error);
      console.error(error.toString());
      let errorMessage = error.toString();
      const detailedErrorMessage = error?.response?.data?.error?.message ?? "";
      if (detailedErrorMessage) errorMessage += "\n" + detailedErrorMessage;
      alert(errorMessage);
    }
  };

  return (
    <>
      {!kakaoOauthToken ? (
        <>
          <Head>
            <title>카카오 로그인 진행중</title>
          </Head>
          <div></div>
        </>
      ) : (
        <>
          <Head>
            <title>회원가입</title>
          </Head>
          <SignupSurvey kakaoOauthToken={kakaoOauthToken} kakaoNickname={kakaoNickname} kakaoEmail={kakaoEmail} kakaoProfileImageUrl={kakaoProfileImageUrl} />
        </>
      )}
    </>
  );
}

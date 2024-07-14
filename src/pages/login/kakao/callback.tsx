import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLayout } from "@/context/LayoutContext";

import SignupSurvey from "@/components/login/signup/signup-survey";
import { kakaoAuthApi } from "@/services/auth";

export default function KakaoLoginCallbackPage() {
  const router = useRouter();
  const [kakaoOauthToken, setkakaoOauthToken] = useState<string>("");
  const [kakaoNickname, setkakaoNickname] = useState<string>("");
  const [kakaoEmail, setkakaoEmail] = useState<string>("");
  const [kakaoProfileImageUrl, setkakaoProfileImageUrl] = useState<string>("");

  const { setHideBottomNavigation } = useLayout();
  useEffect(() => {
    setHideBottomNavigation(true);
    return () => setHideBottomNavigation(false); // 컴포넌트가 언마운트 될 때 다시 보이게 설정
  }, []);

  useEffect(() => {
    const code = router.query.code;
    if (code) {
      sendCodeToBackend(code);
    }
  }, [router.query.code]);

  const sendCodeToBackend = async (code) => {
    await kakaoAuthApi(code)
      .then((res) => {
        const data = res.data;
        if (data.registered) {
          // 기존 회원일 시
          window.localStorage.setItem("accessToken", data.accessToken);
          window.localStorage.setItem("refreshToken", data.refreshToken);
          router.push("/");
        } else if (data.registered == false) {
          // 새로운 회원일 시
          setkakaoOauthToken(data.kakaoOauthToken);
          setkakaoNickname(data.nickname);
          setkakaoEmail(data.email);
          setkakaoProfileImageUrl(data.profileImageUrl);
        }
      })
      .catch((err) => {
        if (err.response) {
          console.error("Axios response error", err.response.data);
          alert(err.response.data?.error?.message);
        } else if (err.reqeust) {
          console.error("Axios request error", err.request);
        } else {
          console.error("Error", err.message);
          alert(err.message);
        }
      });
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

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { kakaoAuthApi } from "@/services/auth";
import { saveAccessToken, saveRefreshToken } from "@/utils/localStorage";

import SignupSurvey from "@/components/login/signup/signup-survey";

import { useLayout } from "@/context/LayoutContext";

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
    const { code } = router.query;
    if (code) {
      sendCodeToBackend(code);
    }
  }, [router.query.code]);

  const sendCodeToBackend = async (code) => {
    await kakaoAuthApi(code)
      .then((res) => {
        const { data } = res;
        if (data.isRegistered) {
          // 기존 회원일 시
          saveAccessToken(data.accessToken);
          saveRefreshToken(data.refreshToken);
          router.push("/");
        } else if (data.isRegistered === false) {
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
          alert(err.response.data?.message);
        } else {
          console.error("Error", err.message);
          alert(err.message);
        }
      });
  };

  if (!kakaoOauthToken) {
    return (
      <>
        <Head>
          <title>카카오 로그인 진행중</title>
        </Head>
        <div />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>회원가입</title>
      </Head>
      <SignupSurvey
        kakaoOauthToken={kakaoOauthToken}
        kakaoNickname={kakaoNickname}
        kakaoEmail={kakaoEmail}
        kakaoProfileImageUrl={kakaoProfileImageUrl}
      />
    </>
  );
}

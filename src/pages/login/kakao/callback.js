import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLayout } from "@/context/LayoutContext";

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
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      sendCodeToBackend(code);
    }
  }, []);

  const sendCodeToBackend = async (code) => {
    try {
      const response = await fetch("/api/auth/kakao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("data", data);
      if (!data.success) {
        throw new Error("Error sending code to backend");
      }

      if (data.registered) {
        // 기존 회원일 시
        router.push("/");
      } else {
        // 새로운 회원일 시
        setkakaoOauthToken(data.data.kakaoOauthToken);
        console.log("가입 토큰 받기 성공1", data.data.kakaoOauthToken);
        setkakaoNickname(data.data.nickname);
        setkakaoEmail(data.data.email);
        setkakaoProfileImageUrl(data.data.profileImageUrl);
      }
      // 토큰과 함께 회원가입 페이지로 이동
      // router.push(
      //   {
      //     pathname: `/login/signup?kakaoOauthToken=${kakaoOauthToken}`,
      //   },
      //   undefined,
      //   { state: { kakaoOauthToken: kakaoOauthToken } }
      // );

      // 성공적으로 처리된 후의 로직 (예: 메인 페이지로 리디렉션)
      // router.push("/"); // 로그인 처리 후 리디렉션
    } catch (error) {
      console.error("Error sending code to backend", error);
    }
  };

  return (
    <>
      {!kakaoOauthToken ? (
        <>
          <Head>
            <title>카카오 로그인 처리 중...</title>
          </Head>
          <div>
            <h1>카카오 로그인 처리 중...</h1>
          </div>
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

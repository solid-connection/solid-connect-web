"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import axios from "axios";

import { saveAccessToken, saveRefreshToken } from "@/utils/localStorage";

import CloudSpinnerPage from "@/components/loading/CloudSpinnerPage";
import SignupSurvey from "@/components/login/signup/SignupSurvey";

import { kakaoAuthApi } from "@/api/auth";
import { useLayout } from "@/context/LayoutContext";

const KakaoLoginCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const [kakaoOauthToken, setKakaoOauthToken] = useState<string>("");
  // const [kakaoNickname, setKakaoNickname] = useState<string>("");
  // const [kakaoEmail, setKakaoEmail] = useState<string>("");
  // const [kakaoProfileImageUrl, setKakaoProfileImageUrl] = useState<string>("");

  const { setHideBottomNavigation } = useLayout();

  useEffect(() => {
    setHideBottomNavigation(true);
    return () => setHideBottomNavigation(false); // 컴포넌트 언마운트 시 다시 보이게 설정
  }, [setHideBottomNavigation]);

  useEffect(() => {
    const code = searchParams?.get("code");
    if (code) {
      sendCodeToBackend(code);
    }
  }, [searchParams]);

  const sendCodeToBackend = async (code: string) => {
    try {
      const res = await kakaoAuthApi(code);
      const { data } = res;
      if (data.isRegistered) {
        // 기존 회원일 시
        saveAccessToken(data.accessToken);
        saveRefreshToken(data.refreshToken);
        router.push("/");
      } else if (data.isRegistered === false) {
        // 새로운 회원일 시
        // setKakaoOauthToken(data.signUpToken);
        // setKakaoNickname(data.nickname);
        // setKakaoEmail(data.email);
        // setKakaoProfileImageUrl(data.profileImageUrl);
        router.push(`/sign-up?token=${data.signUpToken}`);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        console.error("Axios response error", err.response.data);
        alert(err.response.data?.message);
      } else if (err instanceof Error) {
        console.error("Error", err.message);
        alert(err.message);
      } else {
        console.error("Unexpected error", err);
        alert("예상치 못한 에러가 발생했습니다.");
      }
    }
  };

  // if (!kakaoOauthToken) {
  return <CloudSpinnerPage />;
  // }

  // return (
  // <SignupSurvey
  //   signUpToken={kakaoOauthToken}
  //   baseNickname={kakaoNickname}
  //   baseEmail={kakaoEmail}
  //   baseProfileImageUrl={kakaoProfileImageUrl}
  // />
  // );
};

export default KakaoLoginCallbackPage;

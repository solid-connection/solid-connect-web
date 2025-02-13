"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import axios from "axios";

import { appleAuthApi } from "@/services/auth";
import { saveAccessToken, saveRefreshToken } from "@/utils/localStorage";

import CloudSpinnerPage from "@/components/loading/CloudSpinnerPage";
import SignupSurvey from "@/components/login/signup/SignupSurvey";

import { useLayout } from "@/context/LayoutContext";

// AxiosError 타입 가드 사용을 위해 추가

const AppleLoginCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [signUpToken, setSignUpToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");

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
      const res = await appleAuthApi(code);
      const { data } = res;
      if (data.isRegistered) {
        // 기존 회원일 시
        saveAccessToken(data.accessToken);
        saveRefreshToken(data.refreshToken);
        router.push("/");
      } else if (data.isRegistered === false) {
        // 새로운 회원일 시
        setSignUpToken(data.signUpToken);
        setEmail(data.email);
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

  useEffect(() => {
    if (!signUpToken) {
      document.title = "애플 로그인 진행중";
    } else {
      document.title = "회원가입";
    }
  }, [signUpToken]);

  if (!signUpToken) {
    return <CloudSpinnerPage />;
  }

  return <SignupSurvey signUpToken={signUpToken} baseNickname={""} baseEmail={email} baseProfileImageUrl={""} />;
};

export default AppleLoginCallbackPage;

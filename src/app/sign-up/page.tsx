"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import SignupSurvey from "@/components/login/signup/SignupSurvey";

import { useLayout } from "@/context/LayoutContext";

const SignUpPage = () => {
  const searchParams = useSearchParams();
  const signUpToken = searchParams?.get("token");

  const { setHideBottomNavigation } = useLayout();

  useEffect(() => {
    setHideBottomNavigation(true);
    return () => setHideBottomNavigation(false); // 컴포넌트 언마운트 시 다시 보이게 설정
  }, [setHideBottomNavigation]);

  if (!signUpToken) {
    // 토큰이 없을 경우 처리 (예: 로그인 페이지로 리다이렉트)
    return <div>유효하지 않은 접근입니다.</div>;
  }

  return (
    <div>
      <SignupSurvey signUpToken={signUpToken} baseNickname="" baseEmail="" baseProfileImageUrl="" />
    </div>
  );
};

export default SignUpPage;

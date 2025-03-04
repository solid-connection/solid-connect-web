"use client";

import { useEffect } from "react";

import WhiteTopNavigation from "@/components/layout/WhiteTopNavigation";
import SignupSurvey from "@/components/login/signup/SignupSurvey";

import { useLayout } from "@/context/LayoutContext";

const SignUpPage = () => {
  const { setHideBottomNavigation } = useLayout();

  useEffect(() => {
    setHideBottomNavigation(true);
    return () => setHideBottomNavigation(false); // 컴포넌트가 언마운트될 때 다시 보이게 설정
  }, [setHideBottomNavigation]);

  return (
    <div>
      <WhiteTopNavigation />
      <SignupSurvey />
    </div>
  );
};

export default SignUpPage;

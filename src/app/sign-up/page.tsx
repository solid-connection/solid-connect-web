"use client";

import { useRouter, useSearchParams } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import SignupSurvey from "@/components/login/signup/SignupSurvey";

const SignUpPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signUpToken = searchParams?.get("token");

  if (!signUpToken) {
    router.push("/login");
  }

  return (
    <>
      <TopDetailNavigation title="회원가입" />
      <SignupSurvey signUpToken={signUpToken} baseNickname="" baseEmail="" baseProfileImageUrl="" />
    </>
  );
};

export default SignUpPage;

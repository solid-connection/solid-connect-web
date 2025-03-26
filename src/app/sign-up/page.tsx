"use client";

import { useRouter, useSearchParams } from "next/navigation";

import SignupSurvey from "@/components/login/signup/SignupSurvey";

const SignUpPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signUpToken = searchParams?.get("token");

  if (!signUpToken) {
    router.push("/login");
  }

  return (
    <div>
      <SignupSurvey signUpToken={signUpToken} baseNickname="" baseEmail="" baseProfileImageUrl="" />
    </div>
  );
};

export default SignUpPage;

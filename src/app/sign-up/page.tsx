import type { Metadata } from "next";
import { Suspense } from "react";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import SignupSurvey from "@/components/login/signup/SignupSurvey";

export const metadata: Metadata = {
  title: "회원가입",
};

const SignUpPage = () => {
  return (
    <>
      <TopDetailNavigation title="회원가입" />
      <div className="w-full px-5">
        <Suspense fallback={<div>Loading...</div>}>
          <SignupSurvey baseNickname="" baseEmail="" baseProfileImageUrl="" />
        </Suspense>
      </div>
    </>
  );
};

export default SignUpPage;

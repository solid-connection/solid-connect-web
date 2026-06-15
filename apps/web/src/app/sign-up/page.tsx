import type { Metadata } from "next";
import { Suspense } from "react";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import SignupSurvey from "@/components/login/signup/SignupSurvey";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

export const metadata: Metadata = {
  title: "회원가입",
  robots: NO_INDEX_ROBOTS,
};

const SignUpPage = () => {
  return (
    <>
      <TopDetailNavigation title="회원가입" />
      <div className="w-full px-5">
        <Suspense fallback={<CloudSpinnerPage />}>
          <SignupSurvey baseNickname="" baseEmail="" baseProfileImageUrl="" />
        </Suspense>
      </div>
    </>
  );
};

export default SignUpPage;

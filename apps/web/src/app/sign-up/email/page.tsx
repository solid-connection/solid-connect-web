import type { Metadata } from "next";
import { Suspense } from "react";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

import EmailSignUpForm from "./EmailSignUpForm";

export const metadata: Metadata = {
  title: "이메일로 시작하기",
  robots: NO_INDEX_ROBOTS,
};

const EmailSignUpPage = () => {
  return (
    <>
      <TopDetailNavigation title="이메일로 시작하기" />
      <div className="w-full px-5">
        <Suspense fallback={<div>Loading...</div>}>
          <EmailSignUpForm />
        </Suspense>
      </div>
    </>
  );
};

export default EmailSignUpPage;

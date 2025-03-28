import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import EmailSignUpForm from "./EmailSignUpForm";

export const metadata: Metadata = {
  title: "이메일로 시작하기",
};

const EmailSignUpPage = () => {
  return (
    <>
      <TopDetailNavigation title="이메일로 시작하기" />
      <EmailSignUpForm />
    </>
  );
};

export default EmailSignUpPage;

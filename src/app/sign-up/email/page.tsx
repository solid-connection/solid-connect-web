import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import EmailSignUpForm from "./EmailSignUpForm";

const EmailSignUpPage = () => {
  return (
    <>
      <TopDetailNavigation title="이메일로 시작하기" />
      <EmailSignUpForm />
    </>
  );
};

export default EmailSignUpPage;

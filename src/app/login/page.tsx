import { Metadata } from "next";

import LoginContent from "./LoginContent";

export const metadata: Metadata = {
  title: "로그인",
};

const LoginPage = () => {
  return <LoginContent />;
};

export default LoginPage;

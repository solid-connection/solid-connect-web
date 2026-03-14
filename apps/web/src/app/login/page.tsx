import type { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "로그인",
};

const LoginPage = () => {
  return <LoginPageClient />;
};

export default LoginPage;

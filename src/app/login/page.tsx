import { Metadata } from "next";

import LoginContent from "./LoginContent";
import KakaoScriptLoaderWrapper from "@/lib/ScriptLoader/KakaoScriptLoaderWrapper";

export const metadata: Metadata = {
  title: "로그인",
};

const LoginPage = () => {
  return (
    <>
      <KakaoScriptLoaderWrapper />
      <LoginContent />
    </>
  );
};

export default LoginPage;

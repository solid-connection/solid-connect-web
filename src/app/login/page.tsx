import { Metadata } from "next";
import dynamic from "next/dynamic";

import LoginContent from "./LoginContent";

const KakaoScriptLoader = dynamic(() => import("@/lib/ScriptLoader/KakaoScriptLoader"), {
  ssr: false,
  loading: () => null,
});

export const metadata: Metadata = {
  title: "로그인",
};

const LoginPage = () => {
  return (
    <>
      <KakaoScriptLoader />
      <LoginContent />
    </>
  );
};

export default LoginPage;

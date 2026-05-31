import type { Metadata } from "next";
import KakaoScriptLoader from "@/lib/ScriptLoader/KakaoScriptLoader";
import LoginContent from "./LoginContent";

export const metadata: Metadata = {
  title: "로그인",
};

const LoginPage = () => {
  return (
    <div className="w-full px-5">
      <KakaoScriptLoader />
      <LoginContent />
    </div>
  );
};

export default LoginPage;

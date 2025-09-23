import { Metadata } from "next";
import dynamic from "next/dynamic";

const KakaoScriptLoader = dynamic(() => import("@/lib/ScriptLoader/KakaoScriptLoader"), {
  ssr: false,
  loading: () => null,
});
const LoginContent = dynamic(() => import("./LoginContent"), { ssr: false });

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

import type { Metadata } from "next";
import { Suspense } from "react";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import KakaoScriptLoader from "@/lib/ScriptLoader/KakaoScriptLoader";
import { NO_INDEX_ROBOTS } from "@/utils/seo";
import LoginContent from "./LoginContent";

export const metadata: Metadata = {
  title: "로그인",
  robots: NO_INDEX_ROBOTS,
};

const LoginPage = () => {
  return (
    <div className="w-full px-5">
      <KakaoScriptLoader />
      <Suspense fallback={<CloudSpinnerPage />}>
        <LoginContent />
      </Suspense>
    </div>
  );
};

export default LoginPage;

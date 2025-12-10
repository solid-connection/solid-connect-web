import { Metadata } from "next";
import React, { Suspense } from "react";

import KakaoLoginCallbackPage from "./KakaoLoginCallbackPage";

export const metadata: Metadata = {
  title: "카카오 로그인 중...",
};

const Page = () => (
  <div className="w-full px-5">
    <Suspense fallback={<div>Loading...</div>}>
      <KakaoLoginCallbackPage />
    </Suspense>
  </div>
);

export default Page;

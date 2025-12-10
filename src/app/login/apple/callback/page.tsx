import { Metadata } from "next";
import React, { Suspense } from "react";

import AppleLoginCallbackPage from "./AppleLoginCallbackPage";

export const metadata: Metadata = {
  title: "애플 로그인 중...",
};

const Page = () => (
  <div className="w-full px-5">
    <Suspense fallback={<div>Loading...</div>}>
      <AppleLoginCallbackPage />
    </Suspense>
  </div>
);

export default Page;

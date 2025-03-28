import { Metadata } from "next";
import React, { Suspense } from "react";

import AppleLoginCallbackPage from "./AppleLoginCallbackPage";

export const metadata: Metadata = {
  title: "애플 로그인 중...",
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AppleLoginCallbackPage />
  </Suspense>
);

export default Page;

import type { Metadata } from "next";
import { Suspense } from "react";

import { NO_INDEX_ROBOTS } from "@/utils/seo";
import AppleLoginCallbackPage from "./AppleLoginCallbackPage";

export const metadata: Metadata = {
  title: "애플 로그인 중...",
  robots: NO_INDEX_ROBOTS,
};

const Page = () => (
  <div className="w-full px-5">
    <Suspense fallback={<div>Loading...</div>}>
      <AppleLoginCallbackPage />
    </Suspense>
  </div>
);

export default Page;

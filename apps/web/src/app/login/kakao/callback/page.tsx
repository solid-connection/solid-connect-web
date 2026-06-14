import type { Metadata } from "next";
import { Suspense } from "react";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import { NO_INDEX_ROBOTS } from "@/utils/seo";
import KakaoLoginCallbackPage from "./KakaoLoginCallbackPage";

export const metadata: Metadata = {
  title: "카카오 로그인 중...",
  robots: NO_INDEX_ROBOTS,
};

const Page = () => (
  <div className="w-full px-5">
    <Suspense fallback={<CloudSpinnerPage />}>
      <KakaoLoginCallbackPage />
    </Suspense>
  </div>
);

export default Page;

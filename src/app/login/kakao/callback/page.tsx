import React, { Suspense } from "react";

import KakaoLoginCallbackPage from "./KakaoLoginCallbackPage";

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <KakaoLoginCallbackPage />
  </Suspense>
);

export default Page;

import React, { Suspense } from "react";

import AppleLoginCallbackPage from "./AppleLoginCallbackPage";

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AppleLoginCallbackPage />
  </Suspense>
);

export default Page;

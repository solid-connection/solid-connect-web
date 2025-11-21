"use client";

import dynamic from "next/dynamic";

const AppleScriptLoader = dynamic(() => import("./AppleScriptLoader"), {
  ssr: false,
  loading: () => null,
});

const AppleScriptLoaderWrapper = () => {
  return <AppleScriptLoader />;
};

export default AppleScriptLoaderWrapper;

"use client";

import dynamic from "next/dynamic";

const KakaoScriptLoader = dynamic(() => import("./KakaoScriptLoader"), {
  ssr: false,
  loading: () => null,
});

const KakaoScriptLoaderWrapper = () => {
  return <KakaoScriptLoader />;
};

export default KakaoScriptLoaderWrapper;

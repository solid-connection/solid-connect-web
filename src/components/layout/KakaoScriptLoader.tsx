"use client";

import Script from "next/script";

const KakaoScriptLoader = () => {
  const kakaoInit = () => {
    if (typeof window !== "undefined" && window.Kakao) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
  };

  return <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="afterInteractive" onLoad={kakaoInit} />;
};

export default KakaoScriptLoader;

"use client";

import Script from "next/script";
import { useEffect } from "react";

const KakaoScriptLoader = () => {
  useEffect(() => {
    const kakaoInit = () => {
      if (typeof window !== "undefined" && window.Kakao) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }
    };
    kakaoInit();
  }, []);

  return <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="afterInteractive" />;
};

export default KakaoScriptLoader;

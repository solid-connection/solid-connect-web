// fonts
import { Inter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";

import Layout from "@/components/layout/layout";

import { LayoutProvider } from "@/context/LayoutContext";
import "@/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  function kakaoInit() {
    // 페이지가 로드되면 실행
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    // console.log(window.Kakao.isInitialized());
  }
  return (
    <LayoutProvider>
      <>
        <Head>
          <meta name="description" content="solid connection" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1" />
          <meta property="og:title" content="솔리드 커넥션" />
          <meta property="og:description" content="솔리드 커넥션. 교환학생의 첫 걸음" />
          <meta property="og:image" content="/images/site-thumbnail.png" />
          <meta property="og:url" content="https://solid-connect.net" />
          <meta property="og:locale" content="ko_KR" />
          <link rel="icon" href="/icons/favicon_48.ico" />
          <title>솔리드 커넥션</title>
        </Head>
        <Layout>
          <Script src="https://developers.kakao.com/sdk/js/kakao.js" onLoad={kakaoInit} />
          <Component {...pageProps} />
          {/* <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} /> */}
          <GoogleAnalytics gaId="G-V1KLYZC1DS" />
        </Layout>
      </>
    </LayoutProvider>
  );
}

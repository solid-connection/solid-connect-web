import Layout from "@/components/layout/layout";
import "@/styles/globals.css";

import Head from "next/head";
import Script from "next/script";
// import { SessionProvider } from "next-auth/react";

// fonts
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  function kakaoInit() {
    // 페이지가 로드되면 실행
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    // console.log(window.Kakao.isInitialized());
  }
  return (
    <>
      <Head>
        <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');</style>
        <meta name="description" content="solid connection" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1" />
        <link rel="icon" href="/favicon.svg" />
        <title>솔리드 커넥션</title>
      </Head>
      {/* <SessionProvider session={pageProps.session}> */}
      <Layout>
        {/* <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js" integrity="sha384-6MFdIr0zOira1CHQkedUqJVql0YtcZA1P0nbPrQYJXVJZUkTk/oX4U9GhUIs3/z8" crossorigin="anonymous"></script> */}
        <Script src="https://developers.kakao.com/sdk/js/kakao.js" onLoad={kakaoInit}></Script>
        <Component {...pageProps} />
      </Layout>
      {/* </SessionProvider> */}
    </>
  );
}

import Head from "next/head";
import Script from "next/script";

import "@/styles/globals.css";
import { LayoutProvider } from "@/context/LayoutContext";
import Layout from "@/components/layout/layout";

// fonts
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

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
          <link rel="icon" href="/favicon.svg" />
          <title>솔리드 커넥션</title>
        </Head>
        <Layout>
          <Script src="https://developers.kakao.com/sdk/js/kakao.js" onLoad={kakaoInit}></Script>
          <Component {...pageProps} />
        </Layout>
      </>
    </LayoutProvider>
  );
}

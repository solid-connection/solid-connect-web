/* eslint-disable @next/next/no-css-tags */
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import localFont from "next/font/local";

import GlobalLayout from "@/components/layout/GlobalLayout";

import { AlertProvider } from "@/context/AlertContext";
import QueryProvider from "@/lib/react-query/QueryProvider";
import "@/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "솔리드 커넥션",
  description: "솔리드 커넥션. 교환학생의 첫 걸음",
};

// 🎯 폰트 최적화: 하나의 폰트만 사용
const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
  preload: true,
  // 폰트 로딩 실패 시 fallback 폰트 체인
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Apple SD Gothic Neo",
    "Malgun Gothic",
    "맑은 고딕",
    "sans-serif",
  ],
});

const KakaoScriptLoader = dynamic(() => import("@/lib/ScriptLoader/KakaoScriptLoader"), {
  ssr: false,
  loading: () => null,
});

const AppleScriptLoader = dynamic(() => import("@/lib/ScriptLoader/AppleScriptLoader"), {
  ssr: false,
  loading: () => null,
});

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <AlertProvider>
    <html lang="ko" className={pretendard.variable}>
      <head>
        {/* 🚀 최우선 폰트 preload */}
        <link
          rel="preload"
          href="/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* 폰트 로딩 최적화를 위한 Critical CSS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html {
                font-family: var(--font-pretendard), system-ui, -apple-system, sans-serif;
                font-synthesis: none;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              .font-loading {
                font-family: system-ui, -apple-system, sans-serif;
              }
            `,
          }}
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//connect.facebook.net" />
        <link rel="dns-prefetch" href="//t1.kakaocdn.net" />
      </head>
      <body className={pretendard.className}>
        <KakaoScriptLoader />
        <AppleScriptLoader />
        <GoogleAnalytics gaId="G-V1KLYZC1DS" />
        <QueryProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </QueryProvider>
      </body>
    </html>
  </AlertProvider>
);

export default RootLayout;

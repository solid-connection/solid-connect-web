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

// 🎯 폰트 최적화: 하나의 폰트만 사용 + 즉시 로딩
const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "optional", // swap → optional로 변경 (3초 후 fallback)
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
        {/* 폰트 preload - CSS 블로킹 방지 */}
        <link
          rel="preload"
          href="/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* 최소한의 Critical CSS - 폰트 최적화만 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* 폰트 즉시 렌더링 */
              html {
                font-family: var(--font-pretendard), system-ui, -apple-system, sans-serif;
                font-synthesis: none;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              
              body {
                margin: 0;
                background: white;
                font-family: system-ui, -apple-system, sans-serif; /* 폰트 로딩 전 즉시 렌더링 */
              }
              
              /* LCP 이미지만 최적화 */
              .w-\\[153px\\] { width: 153px; }
              .h-\\[120px\\] { height: 120px; }
              .rounded-lg { border-radius: 0.5rem; }
              .object-cover { object-fit: cover; }
            `,
          }}
        />
      </head>
      <body className={pretendard.className}>
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

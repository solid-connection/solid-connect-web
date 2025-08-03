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

        {/* Critical CSS 대폭 확장 - CSS 파일 블로킹 제거 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* 폰트 최적화 */
              html {
                font-family: var(--font-pretendard), system-ui, -apple-system, sans-serif;
                font-synthesis: none;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              
              /* 기본 레이아웃 - CSS 블로킹 방지 */
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              
              body {
                margin: 0;
                background: white;
                line-height: 1.6;
                font-family: system-ui, -apple-system, sans-serif; /* 즉시 렌더링 */
              }
              
              /* 이미지 최적화 */
              img {
                max-width: 100%;
                height: auto;
              }
              
              /* LCP 이미지 클래스들 - 즉시 렌더링 */
              .relative { position: relative; }
              .w-\\[153px\\] { width: 153px; }
              .h-\\[120px\\] { height: 120px; }
              .rounded-lg { 
                border-radius: 0.5rem;
                transform: translateZ(0);
                backface-visibility: hidden;
                contain: layout;
              }
              .object-cover { object-fit: cover; }
              .overflow-hidden { overflow: hidden; }
              .bg-gray-200 { background-color: #e5e7eb; }
              
              /* Flex 레이아웃 */
              .flex { display: flex; }
              .gap-2 { gap: 0.5rem; }
              .overflow-x-auto { 
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
              }
              
              /* 폰트 관련 */
              .font-semibold { font-weight: 600; }
              .text-sm { font-size: 0.875rem; }
              .text-lg { font-size: 1.125rem; }
              .text-white { color: white; }
              .text-gray-700 { color: #374151; }
              .text-gray-500 { color: #6b7280; }
              .text-k-700 { color: #374151; }
              .text-k-500 { color: #6b7280; }
              
              /* 위치 관련 */
              .absolute { position: absolute; }
              .bottom-\\[9px\\] { bottom: 9px; }
              .left-\\[10px\\] { left: 10px; }
              .z-10 { z-index: 10; }
              
              /* 링크 */
              .underline { text-decoration: underline; }
              
              /* 컨테이너 */
              .container { 
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1rem;
              }
              
              /* 버튼 기본 */
              button {
                cursor: pointer;
                border: none;
                background: none;
              }
              
              /* 폰트 로딩 완료 후 적용 */
              .font-loaded {
                font-family: var(--font-pretendard), system-ui, -apple-system, sans-serif;
              }
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

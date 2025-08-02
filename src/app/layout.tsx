/* eslint-disable @next/next/no-css-tags */
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import GlobalLayout from "@/components/layout/GlobalLayout";

import { AlertProvider } from "@/context/AlertContext";
import QueryProvider from "@/lib/react-query/QueryProvider";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "솔리드 커넥션",
  description: "솔리드 커넥션. 교환학생의 첫 걸음",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // FOUT 방지
  preload: true,
});

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap", // FOUT 방지를 위한 swap 설정
  weight: "45 920",
  variable: "--font-pretendard",
  preload: true, // 폰트 우선 로딩
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
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <AlertProvider>
    <html lang="ko">
      <head>
        {/* Critical 폰트 preload with high priority */}
        <link
          rel="preload"
          href="/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Prevent layout shift with font-display: swap */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Pretendard';
                src: url('/fonts/PretendardVariable.woff2') format('woff2');
                font-weight: 45 920;
                font-display: swap;
                font-style: normal;
              }
            `,
          }}
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//connect.facebook.net" />
        <link rel="dns-prefetch" href="//t1.kakaocdn.net" />
      </head>
      <body className={`${pretendard.className} ${inter.className}`}>
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

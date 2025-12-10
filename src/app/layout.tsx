import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import localFont from "next/font/local";

import GlobalLayout from "@/components/layout/GlobalLayout";
import ToastContainer from "@/components/ui/Toast";

import QueryProvider from "@/lib/react-query/QueryProvider";
import "@/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "솔리드 커넥션",
  description: "솔리드 커넥션. 교환학생의 첫 걸음",
};

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
  preload: true,
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
    Kakao: unknown;
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ko" className={pretendard.variable}>
    <head>
      <link rel="preload" href="/fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </head>
    <body className={pretendard.className}>
      <AppleScriptLoader />
      <GoogleAnalytics gaId="G-V1KLYZC1DS" />
      <QueryProvider>
        <GlobalLayout>{children}</GlobalLayout>
        <ToastContainer />
      </QueryProvider>
    </body>
  </html>
);

export default RootLayout;

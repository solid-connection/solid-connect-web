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
  display: "swap",
});

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
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
        <link rel="preload" href="/_next/static/css/globals.css" as="style" />
        <link
          rel="stylesheet"
          href="/_next/static/css/globals.css"
          media="print"
          onLoad={(e) => {
            (e.currentTarget as HTMLLinkElement).media = "all";
          }}
        />
        <noscript>
          <link rel="stylesheet" href="/_next/static/css/globals.css" />
        </noscript>
      </head>
      <KakaoScriptLoader />
      <AppleScriptLoader />
      <GoogleAnalytics gaId="G-V1KLYZC1DS" />
      <body className={`${pretendard.className} ${inter.className}`}>
        <QueryProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </QueryProvider>
      </body>
    </html>
  </AlertProvider>
);

export default RootLayout;

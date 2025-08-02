import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import GlobalLayout from "@/components/layout/GlobalLayout";

import "../styles/globals.css";

import { AlertProvider } from "@/context/AlertContext";
import AppleScriptLoader from "@/lib/ScriptLoader/AppleScriptLoader";
import KakaoScriptLoader from "@/lib/ScriptLoader/KakaoScriptLoader";
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

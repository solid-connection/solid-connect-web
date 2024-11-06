import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import KakaoScriptLoader from "@/components/layout/KakaoScriptLoader";
import Layout from "@/components/layout/layout";

import "../styles/globals.css";

import { AlertProvider } from "@/context/AlertContext";
import { LayoutProvider } from "@/context/LayoutContext";
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

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <AlertProvider>
    <LayoutProvider>
      <html lang="ko">
        <KakaoScriptLoader />
        <GoogleAnalytics gaId="G-V1KLYZC1DS" />
        <body className={`${pretendard.className} ${inter.className}`}>
          <Layout>{children}</Layout>
        </body>
      </html>
    </LayoutProvider>
  </AlertProvider>
);

export default RootLayout;

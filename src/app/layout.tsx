import type { Metadata } from "next";

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

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AlertProvider>
      <LayoutProvider>
        <html lang="ko">
          <KakaoScriptLoader />
          <GoogleAnalytics gaId="G-V1KLYZC1DS" />
          <body>
            <Layout>{children}</Layout>
          </body>
        </html>
      </LayoutProvider>
    </AlertProvider>
  );
};

export default RootLayout;

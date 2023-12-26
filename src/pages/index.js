import Head from "next/head";

import TopNavigation from "@/components/layout/top-navigation";
import Home from "@/components/home/home";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function HomePage() {
  return (
    <div>
      <Head>
        <title>Home Page</title>
      </Head>
      <TopNavigation />
      <Home />
    </div>
  );
}

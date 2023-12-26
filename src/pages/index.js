import Head from "next/head";
import { Inter } from "next/font/google";
import TopNavigation from "@/components/layout/top-navigation";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home Page</title>
        {/* Include any other head tags like meta tags here */}
      </Head>
      <TopNavigation />
      <p>Main page</p>
    </div>
  );
}

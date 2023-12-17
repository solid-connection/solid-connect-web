import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home Page</title>
        {/* Include any other head tags like meta tags here */}
      </Head>
      <p>Main page</p>
    </div>
  );
}

import Layout from "@/components/layout/layout";
import "@/styles/globals.css";

import Head from "next/head";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="description" content="solid connection" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1" />
        <title>solid connection</title>
      </Head>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
}

import Layout from "@/components/layout/layout";
import "@/styles/globals.css";

import Head from "next/head";
import { Fragment } from "react";

export default function App({ Component, pageProps }) {
  return (
    <Fragment>
      <Layout>
        <Head>
          <title>solid connection</title>
          <meta name="description" content="solid connection" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  );
}

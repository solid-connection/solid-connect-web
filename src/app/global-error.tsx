"use client";

import NextError from "next/error";
import { useEffect } from "react";

import * as Sentry from "@sentry/nextjs";

// Error boundaries must be Client Components

const GlobalError = ({ error }: { error: Error & { digest?: string } }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
};

export default GlobalError;

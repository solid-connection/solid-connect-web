"use client";

import NextError from "next/error";

// Error boundaries must be Client Components

const GlobalError = ({ error }: { error: Error & { digest?: string } }) => {
  void error;

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
};

export default GlobalError;

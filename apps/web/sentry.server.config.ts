// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

// 프로덕션 환경에서만 Sentry 초기화
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || "",
    environment: process.env.SENTRY_ENVIRONMENT || "production",

    // Adds request headers and IP for users
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    // Performance Monitoring: 프로덕션에서 30% 샘플링
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 0.3,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}

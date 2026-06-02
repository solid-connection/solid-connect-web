// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

// 프로덕션 환경에서만 Sentry 초기화
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || "",
    environment: process.env.SENTRY_ENVIRONMENT || "production",

    // Performance Monitoring: 프로덕션에서 30% 샘플링
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 0.3,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}

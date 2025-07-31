import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
  environment: process.env.SENTRY_ENVIRONMENT || "development",
  tracesSampleRate: 1.0,

  integrations: [
    Sentry.browserTracingIntegration({
      tracePropagationTargets: ["localhost", /^https:\/\/(www\.)?solid\-connection\.com/],
    }),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
  environment: process.env.SENTRY_ENVIRONMENT || "development",
  tracesSampleRate: 1.0,

  // Trace propagation targets (Sentry 10+)
  tracePropagationTargets: [
    "localhost",
    "solid-connection.com",
    "solid-connect-web",
    "solid-connect",
    /^https:\/\/(www\.)?solid[\-]?connection\.com/,
  ],

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

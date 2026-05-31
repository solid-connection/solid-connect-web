import * as Sentry from "@sentry/nextjs";

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || "",
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.SENTRY_ENVIRONMENT || "production",

    sendDefaultPii: true,
    tracesSampleRate: 0.3,

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    tracePropagationTargets: ["solid-connection.com", /^https:\/\/(www\.)?solid[-]?connection\.com/],

    integrations: [
      Sentry.browserTracingIntegration({
        enableInp: true,
      }),
    ],
  });

  Sentry.lazyLoadIntegration("replayIntegration").then((replay) => {
    Sentry.addIntegration(
      replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    );
  });
}

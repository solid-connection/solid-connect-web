import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
  environment: process.env.SENTRY_ENVIRONMENT || "development",
  tracesSampleRate: 1.0,

  // Replay 샘플링 설정
  replaysSessionSampleRate: 0.1, // 일반 세션의 10%
  replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100%

  integrations: [
    Sentry.browserTracingIntegration({
      tracePropagationTargets: [
        "localhost",
        "solid-connection.com",
        "solid-connect-web",
        "solid-connect",
        /^https:\/\/(www\.)?solid[\-]?connection\.com/,
      ],
      // Web Vitals 자동 수집 활성화
      enableInp: true, // Interaction to Next Paint
    }),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

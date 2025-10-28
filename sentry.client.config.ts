import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
  environment: process.env.SENTRY_ENVIRONMENT || "development",

  // Performance Monitoring: 모든 트랜잭션 샘플링 (프로덕션에서는 0.1~0.3 권장)
  tracesSampleRate: 1.0,

  // Replay 샘플링 설정
  replaysSessionSampleRate: 0.1, // 일반 세션의 10%
  replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100%

  integrations: [
    // Browser Tracing: 페이지 로드 및 네비게이션 성능 측정
    Sentry.browserTracingIntegration({
      tracePropagationTargets: [
        "localhost",
        "solid-connection.com",
        "solid-connect-web",
        "solid-connect",
        /^https:\/\/(www\.)?solid[\-]?connection\.com/,
      ],
      // Web Vitals 자동 수집 활성화
      enableInp: true, // Interaction to Next Paint (INP) 측정
    }),

    // Session Replay: 사용자 세션 녹화
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

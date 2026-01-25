import * as Sentry from "@sentry/nextjs";

// 프로덕션 환경에서만 Sentry 초기화
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || "",
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.SENTRY_ENVIRONMENT || "production",

    // Adds request headers and IP for users
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    // Performance Monitoring: 프로덕션에서 30% 샘플링
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 0.3,

    // Session Replay 샘플링 설정
    // Capture Replay for 10% of all sessions, plus 100% of sessions with an error
    // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
    replaysSessionSampleRate: 0.1, // 일반 세션의 10%
    replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100%

    // tracePropagationTargets는 최상위 옵션으로 설정
    tracePropagationTargets: ["solid-connection.com", /^https:\/\/(www\.)?solid[-]?connection\.com/],

    integrations: [
      // Browser Tracing: 페이지 로드 및 네비게이션 성능 측정
      Sentry.browserTracingIntegration({
        // Web Vitals 자동 수집 활성화
        enableInp: true, // Interaction to Next Paint (INP) 측정
      }),

      // Session Replay: 사용자 세션 녹화 (클라이언트 전용)
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}

// Injected content via Sentry wizard below
import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 캐시 최적화
  cacheMaxMemorySize: 50 * 1024 * 1024, // 50MB - Turbopack 메모리 캐시

  // 🖼️ 이미지 최적화
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "solid-connection.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "solid-connection-uploaded.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "d1q5o8tzvz4j3d.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "d23lwokhcc3r0c.cloudfront.net",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280],
    minimumCacheTTL: 60, // 이미지 캐시 TTL (초)
  },

  // ⚡ 개발 모드 최적화
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 페이지가 메모리에 유지되는 시간
    pagesBufferLength: 5, // 동시에 메모리에 유지할 페이지 수
  },
  // 🎨 Turbopack 설정 (Next.js 16+ 기본)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // 🔧 Webpack 설정 (fallback - --webpack 플래그 사용시)
  webpack: (config, { isServer }) => {
    // SVG 로더
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // 빌드 캐시 최적화
    if (!isServer) {
      config.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    return config;
  },
};

export default withSentryConfig(
  nextConfig,
  {
    // Sentry Webpack Plugin 설정
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    // Sentry SDK 설정 (빌드 성능 최적화)

    // 소스맵 업로드 최소화 (빌드 속도 향상)
    widenClientFileUpload: false,

    // IE11 지원 제거 (번들 크기 & 빌드 속도 개선)
    transpileClientSDK: false,

    // Ad-blocker 우회
    tunnelRoute: "/monitoring",

    // 프로덕션 소스맵 숨김
    hideSourceMaps: true,

    // Sentry 로거 제거 (번들 크기 감소)
    disableLogger: true,

    // Vercel Cron 모니터링
    automaticVercelMonitors: true,
  },
);

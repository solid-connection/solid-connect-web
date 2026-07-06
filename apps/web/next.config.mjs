// Injected content via Sentry wizard below

import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const shouldRunBundleAnalyzer = process.env.ANALYZE === "true";
const svgComponentLoaders = ["@svgr/webpack"];

const withBundleAnalyzer = bundleAnalyzer({
  enabled: shouldRunBundleAnalyzer,
});

const imageRemotePatterns = [
  "k.kakaocdn.net",
  "cdn.default.solid-connection.com",
  "cdn.upload.solid-connection.com",
].map((hostname) => ({
  protocol: "https",
  hostname,
}));

const universityWebDomain = process.env.UNIVERSITY_WEB_DOMAIN?.replace(/\/$/, "");
const isProductionRuntime = process.env.NODE_ENV === "production";
const universitySlugPattern = "(inha|kyunghee)";

if (isProductionRuntime && !universityWebDomain) {
  throw new Error("UNIVERSITY_WEB_DOMAIN is required because /university catalog routes are served by university-web.");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@solid-connect/ai-inspector", "@solid-connect/ui"],
  reactCompiler: {
    compilationMode: "annotation",
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: svgComponentLoaders,
        as: "*.js",
      },
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: imageRemotePatterns,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280],
  },
  // 압축 활성화
  compress: true,
  // 정적 리소스 최적화
  experimental: {
    optimizeCss: true,
    gzipSize: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-select",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-label",
      "@radix-ui/react-progress",
      "@tanstack/react-query",
      "class-variance-authority",
      "tailwind-merge",
      "zod",
      "react-hook-form",
      "@hookform/resolvers",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    if (!universityWebDomain) {
      return [];
    }

    return [
      {
        source: "/university-static/:path*",
        destination: `${universityWebDomain}/university-static/:path*`,
      },
      {
        source: "/university/monitoring",
        destination: `${universityWebDomain}/university/monitoring`,
      },
      {
        source: "/university/revalidate",
        destination: `${universityWebDomain}/university/revalidate`,
      },
      {
        source: "/university",
        destination: `${universityWebDomain}/university`,
      },
      {
        source: "/university/search",
        destination: `${universityWebDomain}/university/search`,
      },
      {
        source: `/university/list/:homeUniversity${universitySlugPattern}`,
        destination: `${universityWebDomain}/university/:homeUniversity`,
      },
      {
        source: `/university/:homeUniversity${universitySlugPattern}`,
        destination: `${universityWebDomain}/university/:homeUniversity`,
      },
      {
        source: `/university/:homeUniversity${universitySlugPattern}/:path*`,
        destination: `${universityWebDomain}/university/:homeUniversity/:path*`,
      },
    ];
  },
  ...(shouldRunBundleAnalyzer
    ? {
        webpack: (config) => {
          // Bundle analyzer still runs through webpack because it is webpack-plugin based.
          if (!config.optimization) {
            config.optimization = {};
          }
          if (!config.optimization.splitChunks) {
            config.optimization.splitChunks = {};
          }
          if (!config.optimization.splitChunks.cacheGroups) {
            config.optimization.splitChunks.cacheGroups = {};
          }

          config.optimization.splitChunks.cacheGroups.styles = {
            name: "styles",
            test: /\.(css|scss)$/,
            chunks: "all",
            enforce: true,
          };

          config.module.rules.push({
            test: /\.svg$/,
            use: svgComponentLoaders,
          });
          return config;
        },
      }
    : {}),
};

export default withSentryConfig(
  withBundleAnalyzer(nextConfig),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // IE11 지원 불필요 - 번들 사이즈 최적화를 위해 비활성화
    transpileClientSDK: false,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);

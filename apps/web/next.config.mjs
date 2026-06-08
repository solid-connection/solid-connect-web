import bundleAnalyzer from "@next/bundle-analyzer";

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
const universitySlugPattern = "(inha|incheon|sungshin)";

if (isProductionRuntime && !universityWebDomain) {
  throw new Error("UNIVERSITY_WEB_DOMAIN is required because /university catalog routes are served by university-web.");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@solid-connect/ai-inspector"],
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

export default withBundleAnalyzer(nextConfig);

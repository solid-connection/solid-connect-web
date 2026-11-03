// Component rendering does not need deployment rewrites or Sentry uploads.
/** @type {import("next").NextConfig} */
export default {
  images: { unoptimized: true },
  transpilePackages: ["@solid-connect/ui"],
  typescript: { tsconfigPath: "../tsconfig.json" },
};

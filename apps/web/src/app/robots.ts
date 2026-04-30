import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL = "https://www.solid-connection.com";

const getSiteUrl = () => (process.env.NEXT_PUBLIC_WEB_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const vercelEnv = process.env.VERCEL_ENV;
  const isNonIndexEnvironment =
    vercelEnv === "preview" ||
    vercelEnv === "development" ||
    siteUrl.includes("stage") ||
    siteUrl.includes("localhost") ||
    siteUrl.includes("127.0.0.1");

  if (isNonIndexEnvironment) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).host,
  };
}

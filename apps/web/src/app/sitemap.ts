import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL = "https://www.solid-connection.com";

const getSiteUrl = () => (process.env.NEXT_PUBLIC_WEB_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  if (siteUrl.includes("stage") || siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1")) {
    return [];
  }

  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/mentor`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/university`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}

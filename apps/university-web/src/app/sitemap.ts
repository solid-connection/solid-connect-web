import type { MetadataRoute } from "next";

import { HOME_UNIVERSITY_SLUGS } from "@/constants/university";

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
      url: `${siteUrl}/university`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/university/search`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...HOME_UNIVERSITY_SLUGS.map((slug) => ({
      url: `${siteUrl}/university/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}

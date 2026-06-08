import type { Metadata } from "next";

export const DEFAULT_SITE_URL = "https://www.solid-connection.com";
export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image.png";

const TRAILING_SLASHES = /\/+$/;
const HTML_TAGS = /<[^>]*>/g;
const WHITESPACE = /\s+/g;

export const NO_INDEX_ROBOTS = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} satisfies Metadata["robots"];

export const getSiteUrl = () => {
  const siteUrl = process.env.NEXT_PUBLIC_WEB_URL || DEFAULT_SITE_URL;
  return siteUrl.replace(TRAILING_SLASHES, "");
};

export const isNonIndexSiteUrl = (siteUrl: string = getSiteUrl()) => {
  const vercelEnv = process.env.VERCEL_ENV;

  return (
    vercelEnv === "preview" ||
    vercelEnv === "development" ||
    siteUrl.includes("stage") ||
    siteUrl.includes("localhost") ||
    siteUrl.includes("127.0.0.1") ||
    siteUrl.includes("[::1]")
  );
};

export const createUrl = (path: string = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${getSiteUrl()}/`).toString();
};

export const createAbsoluteUrl = (url: string | null | undefined, fallbackPath: string = DEFAULT_OG_IMAGE_PATH) => {
  const trimmedUrl = url?.trim();

  if (!trimmedUrl) {
    return createUrl(fallbackPath);
  }

  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }

  return createUrl(trimmedUrl.startsWith("/") ? trimmedUrl : `/${trimmedUrl}`);
};

export const stripHtml = (value: string) => value.replace(HTML_TAGS, " ").replace(WHITESPACE, " ").trim();

export const truncateDescription = (value: string, maxLength: number = 150) => {
  const text = stripHtml(value);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3).trim()}...`;
};

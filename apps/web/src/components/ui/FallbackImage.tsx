"use client";

import NextImage from "next/image";
import { useState } from "react";

const DEFAULT_FALLBACK_SRC = "/svgs/placeholders/image-placeholder.svg";
const DEFAULT_CDN_HOST = "https://cdn.default.solid-connection.com";
const UPLOAD_CDN_HOST = "https://cdn.upload.solid-connection.com";

type CdnHostType = "default" | "upload";

const CDN_HOSTS: Record<CdnHostType, string> = {
  default: process.env.NEXT_PUBLIC_IMAGE_URL || DEFAULT_CDN_HOST,
  upload: process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL || UPLOAD_CDN_HOST,
};

const resolveCdnUrl = (src: string, cdnHostType?: CdnHostType) => {
  const trimmedSrc = src.trim();

  if (trimmedSrc.length === 0) return "";
  if (trimmedSrc.startsWith("http://") || trimmedSrc.startsWith("https://")) return trimmedSrc;
  if (trimmedSrc.startsWith("blob:") || trimmedSrc.startsWith("data:")) return trimmedSrc;
  if (trimmedSrc.startsWith("//")) return `https:${trimmedSrc}`;
  if (!cdnHostType) return trimmedSrc;

  const normalizedHost = CDN_HOSTS[cdnHostType].replace(/\/+$/, "");
  const normalizedPath = trimmedSrc.replace(/^\/+/, "");

  return `${normalizedHost}/${normalizedPath}`;
};

type FallbackImageProps = React.ComponentProps<typeof NextImage> & {
  fallbackSrc?: string;
  cdnHostType?: CdnHostType;
};

const FallbackImage = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  cdnHostType,
  onError,
  ...props
}: FallbackImageProps) => {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  const normalizedSrc = typeof src === "string" ? resolveCdnUrl(src, cdnHostType) || fallbackSrc : src;
  const sourceKey = typeof normalizedSrc === "string" ? normalizedSrc : JSON.stringify(normalizedSrc);
  const hasError = failedSource === sourceKey;
  const resolvedSrc = hasError ? fallbackSrc : normalizedSrc;

  return (
    <NextImage
      {...props}
      src={resolvedSrc}
      onError={(event) => {
        if (!hasError && resolvedSrc !== fallbackSrc) {
          setFailedSource(sourceKey);
        }
        onError?.(event);
      }}
    />
  );
};

export default FallbackImage;

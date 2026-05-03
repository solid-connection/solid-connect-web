"use client";

import NextImage from "next/image";
import { useState } from "react";
import { getUploadCdnOrigin, normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";

const DEFAULT_FALLBACK_SRC = "/svgs/placeholders/image-placeholder.svg";

type CdnHostType = "default" | "upload";

const CDN_HOSTS: Record<CdnHostType, string> = {
  default: getUploadCdnOrigin(),
  upload: getUploadCdnOrigin(),
};

const resolveCdnUrl = (src: string, cdnHostType?: CdnHostType) => {
  const trimmedSrc = src.trim();

  if (trimmedSrc.length === 0) return "";
  if (trimmedSrc.startsWith("http://") || trimmedSrc.startsWith("https://")) {
    return normalizeImageUrlToUploadCdn(trimmedSrc);
  }
  if (trimmedSrc.startsWith("blob:") || trimmedSrc.startsWith("data:")) return trimmedSrc;
  if (trimmedSrc.startsWith("//")) return normalizeImageUrlToUploadCdn(`https:${trimmedSrc}`);
  if (trimmedSrc.startsWith("/")) return trimmedSrc;
  if (!cdnHostType) return normalizeImageUrlToUploadCdn(trimmedSrc);

  const normalizedHost = CDN_HOSTS[cdnHostType].replace(/\/+$/, "");
  const normalizedPath = trimmedSrc.replace(/^\/+/, "");

  return normalizeImageUrlToUploadCdn(`${normalizedHost}/${normalizedPath}`);
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

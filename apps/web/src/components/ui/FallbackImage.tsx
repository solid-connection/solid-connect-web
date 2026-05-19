"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
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
  retryOnError?: boolean;
  retryLimit?: number;
  retryDelayMs?: number;
};

const FallbackImage = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  cdnHostType,
  retryOnError = false,
  retryLimit = 0,
  retryDelayMs = 1000,
  onError,
  ...props
}: FallbackImageProps) => {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sourceKeyRef = useRef<string | null>(null);

  const normalizedSrc = typeof src === "string" ? resolveCdnUrl(src, cdnHostType) || fallbackSrc : src;
  const sourceKey = typeof normalizedSrc === "string" ? normalizedSrc : JSON.stringify(normalizedSrc);
  const hasError = failedSource === sourceKey;
  const resolvedSrc = hasError ? fallbackSrc : normalizedSrc;
  const normalizedRetryLimit = Math.max(0, retryLimit);
  const normalizedRetryDelayMs = Math.max(0, retryDelayMs);
  const canRetry =
    retryOnError &&
    retryAttempt < normalizedRetryLimit &&
    typeof normalizedSrc === "string" &&
    normalizedSrc !== fallbackSrc;

  useEffect(() => {
    if (sourceKeyRef.current === sourceKey) return;

    sourceKeyRef.current = sourceKey;
    setFailedSource(null);
    setRetryAttempt(0);

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, [sourceKey]);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return (
    <NextImage
      {...props}
      key={`${sourceKey}:${hasError ? "fallback" : "source"}:${retryAttempt}`}
      src={resolvedSrc}
      onError={(event) => {
        if (!hasError && resolvedSrc !== fallbackSrc) {
          setFailedSource(sourceKey);

          if (canRetry) {
            if (retryTimeoutRef.current) {
              clearTimeout(retryTimeoutRef.current);
            }

            retryTimeoutRef.current = setTimeout(() => {
              setRetryAttempt((prev) => prev + 1);
              setFailedSource((current) => (current === sourceKey ? null : current));
              retryTimeoutRef.current = null;
            }, normalizedRetryDelayMs);
          }
        }
        onError?.(event);
      }}
    />
  );
};

export default FallbackImage;

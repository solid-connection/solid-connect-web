"use client";

import NextImage from "next/image";
import { useState } from "react";

const DEFAULT_FALLBACK_SRC = "/svgs/placeholders/image-placeholder.svg";

type FallbackImageProps = React.ComponentProps<typeof NextImage> & {
  fallbackSrc?: string;
};

const FallbackImage = ({ src, fallbackSrc = DEFAULT_FALLBACK_SRC, onError, ...props }: FallbackImageProps) => {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  const normalizedSrc = typeof src === "string" ? src.trim() || fallbackSrc : src;
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

const UPLOAD_CDN_ORIGIN = "https://cdn.upload.solid-connection.com";
const UPLOAD_CDN_HOSTNAME = "cdn.upload.solid-connection.com";
const DEFAULT_CDN_HOSTNAME = "cdn.default.solid-connection.com";
const LEGACY_BUCKET_NAME = "solid-connection";

const LOCAL_STATIC_PREFIXES = ["/images/", "/svgs/"];

const isHttpUrl = (value: string) => value.startsWith("http://") || value.startsWith("https://");

const normalizeOrigin = (value: string | undefined) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  try {
    const parsed = new URL(trimmed);
    return `${parsed.protocol}//${parsed.host}`.replace(/\/+$/, "");
  } catch {
    return undefined;
  }
};

const getHostname = (value: string | undefined) => {
  if (!value) return undefined;

  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return undefined;
  }
};

const envUploadOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL);
const envDefaultOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_IMAGE_URL);

const uploadOrigin = envUploadOrigin ?? UPLOAD_CDN_ORIGIN;

const cdnHostnames = new Set(
  [UPLOAD_CDN_HOSTNAME, DEFAULT_CDN_HOSTNAME, getHostname(envUploadOrigin), getHostname(envDefaultOrigin)].filter(
    (hostname): hostname is string => Boolean(hostname),
  ),
);

const legacyS3VirtualHostRegex = new RegExp(
  `^${LEGACY_BUCKET_NAME.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\.s3([.-][a-z0-9-]+)?\\.amazonaws\\.com$`,
  "i",
);

const s3PathStyleHostRegex = /^s3([.-][a-z0-9-]+)?\.amazonaws\.com$/i;

const joinUploadOrigin = (path: string, search = "", hash = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${uploadOrigin}${normalizedPath}${search}${hash}`;
};

const getLegacyS3ObjectPath = (pathname: string) => {
  const prefix = `/${LEGACY_BUCKET_NAME}/`;
  if (pathname.startsWith(prefix)) {
    return pathname.slice(prefix.length - 1);
  }

  if (pathname === `/${LEGACY_BUCKET_NAME}`) {
    return "/";
  }

  return null;
};

const shouldKeepAsLocalStaticPath = (value: string) => {
  return LOCAL_STATIC_PREFIXES.some((prefix) => value.startsWith(prefix));
};

/**
 * 이미지 URL을 upload CDN 기준으로 정규화한다.
 * - 상대 경로(key)는 upload CDN으로 변환
 * - legacy default CDN/S3 URL은 upload CDN으로 변환
 * - 로컬 정적 경로(/images, /svgs), blob/data, 외부 도메인은 유지
 */
export const normalizeImageUrlToUploadCdn = (url: string | null | undefined): string => {
  if (!url) return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return normalizeImageUrlToUploadCdn(`https:${trimmed}`);
  }

  if (trimmed.startsWith("/")) {
    if (shouldKeepAsLocalStaticPath(trimmed)) {
      return trimmed;
    }

    return trimmed;
  }

  if (!isHttpUrl(trimmed)) {
    return joinUploadOrigin(trimmed.replace(/^\/+/, ""));
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return trimmed;
  }

  const hostname = parsed.hostname.toLowerCase();

  if (cdnHostnames.has(hostname)) {
    return joinUploadOrigin(parsed.pathname, parsed.search, parsed.hash);
  }

  if (legacyS3VirtualHostRegex.test(hostname)) {
    return joinUploadOrigin(parsed.pathname, parsed.search, parsed.hash);
  }

  if (s3PathStyleHostRegex.test(hostname)) {
    const objectPath = getLegacyS3ObjectPath(parsed.pathname);
    if (objectPath) {
      return joinUploadOrigin(objectPath, parsed.search, parsed.hash);
    }
  }

  return trimmed;
};

export const getUploadCdnOrigin = () => uploadOrigin;

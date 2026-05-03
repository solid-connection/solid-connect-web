const UPLOAD_CDN_ORIGIN = "https://cdn.upload.solid-connection.com";
const UPLOAD_CDN_HOSTNAME = "cdn.upload.solid-connection.com";
const DEFAULT_CDN_HOSTNAME = "cdn.default.solid-connection.com";
const LEGACY_BUCKET_NAME = "solid-connection";

const s3PathStyleHostRegex = /^s3([.-][a-z0-9-]+)?\.amazonaws\.com$/i;
const legacyS3VirtualHostRegex = new RegExp(
	`^${LEGACY_BUCKET_NAME.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\.s3([.-][a-z0-9-]+)?\\.amazonaws\\.com$`,
	"i",
);

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

const runtimeEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const envUploadOrigin = normalizeOrigin(runtimeEnv?.VITE_UPLOADED_IMAGE_URL);
const envS3BaseOrigin = normalizeOrigin(runtimeEnv?.VITE_S3_BASE_URL);
const uploadOrigin = envUploadOrigin ?? UPLOAD_CDN_ORIGIN;

const cdnHostnames = new Set(
	[UPLOAD_CDN_HOSTNAME, DEFAULT_CDN_HOSTNAME, getHostname(envUploadOrigin), getHostname(envS3BaseOrigin)].filter(
		(hostname): hostname is string => Boolean(hostname),
	),
);

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

const isHttpUrl = (value: string) => value.startsWith("http://") || value.startsWith("https://");

export const normalizeImageUrlToUploadCdn = (url: string | null | undefined): string => {
	if (!url) return "";

	const trimmed = url.trim();
	if (!trimmed) return "";

	if (trimmed.startsWith("blob:") || trimmed.startsWith("data:") || trimmed.startsWith("/")) {
		return trimmed;
	}

	if (trimmed.startsWith("//")) {
		return normalizeImageUrlToUploadCdn(`https:${trimmed}`);
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

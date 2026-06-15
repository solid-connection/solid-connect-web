export const AUTH_REDIRECT_PARAM = "redirect";

const FALLBACK_REDIRECT_PATH = "/";
const COMMUNITY_PATH_PREFIX = "/community/";

export const getSafeCommunityRedirectPath = (redirect: string | null | undefined): string | null => {
  if (!redirect) {
    return null;
  }

  try {
    const origin = typeof window === "undefined" ? "https://solid-connection.com" : window.location.origin;
    const url = new URL(redirect, origin);

    if (url.origin !== origin) {
      return null;
    }

    if (!url.pathname.startsWith(COMMUNITY_PATH_PREFIX)) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
};

export const getCommunityRedirectOrFallback = (redirect: string | null | undefined): string => {
  return getSafeCommunityRedirectPath(redirect) ?? FALLBACK_REDIRECT_PATH;
};

export const buildLoginPathWithRedirect = (redirectPath: string): string => {
  const safeRedirectPath = getSafeCommunityRedirectPath(redirectPath);

  if (!safeRedirectPath) {
    return "/login";
  }

  return `/login?${AUTH_REDIRECT_PARAM}=${encodeURIComponent(safeRedirectPath)}`;
};

export const buildSignUpEmailPathWithRedirect = (redirectPath: string | null | undefined): string => {
  const safeRedirectPath = getSafeCommunityRedirectPath(redirectPath);

  if (!safeRedirectPath) {
    return "/sign-up/email";
  }

  return `/sign-up/email?${AUTH_REDIRECT_PARAM}=${encodeURIComponent(safeRedirectPath)}`;
};

export const buildSignUpPath = ({
  signUpToken,
  redirectPath,
}: {
  signUpToken: string;
  redirectPath?: string | null;
}): string => {
  const params = new URLSearchParams({ token: signUpToken });
  const safeRedirectPath = getSafeCommunityRedirectPath(redirectPath);

  if (safeRedirectPath) {
    params.set(AUTH_REDIRECT_PARAM, safeRedirectPath);
  }

  return `/sign-up?${params.toString()}`;
};

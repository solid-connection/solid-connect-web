export const AUTH_REDIRECT_PARAM = "redirect";

/** 로그인이 필요해 로그인 페이지로 보낼 때 사용자에게 안내할 메시지 */
export const LOGIN_REQUIRED_MESSAGE = "로그인이 필요한 페이지입니다.";

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

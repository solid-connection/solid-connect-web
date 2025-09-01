import Cookies from "js-cookie";

const IS_PREV_LOGIN_COOKIE_NAME = "isPrevLogin";

/**
 * Sets the isPrevLogin cookie with the same expiration as the access token
 * @param expirationTimeInSeconds - Token expiration time in seconds from now
 */
export const setIsPrevLoginCookie = (expirationTimeInSeconds: number): void => {
  const expirationDate = new Date(Date.now() + expirationTimeInSeconds * 1000);

  Cookies.set(IS_PREV_LOGIN_COOKIE_NAME, "true", {
    expires: expirationDate,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "lax", // CSRF protection
  });
};

/**
 * Sets the isPrevLogin cookie with a specific expiration date
 * @param expirationDate - Exact expiration date
 */
export const setIsPrevLoginCookieWithDate = (expirationDate: Date): void => {
  Cookies.set(IS_PREV_LOGIN_COOKIE_NAME, "true", {
    expires: expirationDate,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

/**
 * Checks if the isPrevLogin cookie exists
 * @returns true if cookie exists, false otherwise
 */
export const hasIsPrevLoginCookie = (): boolean => {
  return Cookies.get(IS_PREV_LOGIN_COOKIE_NAME) === "true";
};

/**
 * Removes the isPrevLogin cookie
 */
export const removeIsPrevLoginCookie = (): void => {
  Cookies.remove(IS_PREV_LOGIN_COOKIE_NAME);
};

/**
 * Helper function to calculate expiration from JWT token (if you need to parse the token)
 * @param accessToken - JWT access token
 * @returns expiration time in seconds from now, or null if cannot parse
 */
export const getTokenExpirationSeconds = (accessToken: string): number | null => {
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const exp = payload.exp; // JWT exp is in seconds since epoch
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, exp - now);
  } catch (error) {
    console.error("Failed to parse JWT token:", error);
    return null;
  }
};

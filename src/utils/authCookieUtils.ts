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

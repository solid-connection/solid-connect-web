import { parseJwtPayload } from "./jwtUtils";

export const getTokenExpirationSeconds = (accessToken: string): number | null => {
  const payload = parseJwtPayload<{ exp?: number }>(accessToken);
  if (!payload?.exp) return null;

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
};

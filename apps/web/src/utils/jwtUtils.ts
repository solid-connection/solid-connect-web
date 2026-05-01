interface JwtPayload {
  sub: number | string;
  role: string;
  iat: number;
  exp: number;
}

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) {
      return null;
    }

    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return true; // 토큰이 유효하지 않으면 만료된 것으로 간주
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

export const tokenParse = (token: string | null): JwtPayload | null => {
  if (typeof window === "undefined") return null;

  if (!token) return null;

  return decodeJwtPayload(token);
};

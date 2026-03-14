interface JwtPayload {
  sub: number;
  role: string;
  iat: number;
  exp: number;
}

const decodeBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  const padded = padding === 0 ? base64 : `${base64}${"=".repeat(4 - padding)}`;
  return atob(padded);
};

export const parseJwtPayload = <T = JwtPayload>(token: string | null): T | null => {
  if (!token) return null;

  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;

    const payload = JSON.parse(decodeBase64Url(payloadSegment)) as T;
    return payload;
  } catch (error) {
    console.error("토큰 파싱 오류:", error);
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  const payload = parseJwtPayload<JwtPayload>(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

export const tokenParse = (token: string | null): JwtPayload | null => {
  if (typeof window === "undefined") return null;

  return parseJwtPayload<JwtPayload>(token);
};

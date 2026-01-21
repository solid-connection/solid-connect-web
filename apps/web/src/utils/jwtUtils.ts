interface JwtPayload {
  sub: number;
  role: string;
  iat: number;
  exp: number;
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("토큰 파싱 오류:", error);
    return true; // 토큰이 유효하지 않으면 만료된 것으로 간주
  }
};

export const tokenParse = (token: string | null): JwtPayload | null => {
  if (typeof window === "undefined") return null;

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;
    return payload;
  } catch (error) {
    console.error("토큰 파싱 오류:", error);
    return null;
  }
};

import { getAccessToken } from "@/lib/zustand/useTokenStore";

interface JwtPayload {
  exp: number;
  role?: string;
  [key: string]: unknown;
}

export const isTokenExpired = (token: string): boolean => {
  if (!token) {
    return true;
  }
  try {
    // JWT의 payload 부분을 디코딩합니다 (Base64URL 디코딩)
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;

    // 현재 시간 (초 단위로)
    const currentTime = Math.floor(Date.now() / 1000);

    // 토큰의 만료 시간 (`exp` 클레임)
    const { exp } = payload;

    // 토큰이 만료되었는지 확인
    return exp < currentTime;
  } catch (error) {
    console.error("인증 토큰에 문제가 있습니다:", error);
    // 토큰이 잘못된 경우 만료된 것으로 간주
    return true;
  }
};

export const decodeExp = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;
    const { exp } = payload;
    return exp * 1000; // → ms
  } catch {
    return 0;
  }
};

export const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
};

// Zustand 기반 토큰 유틸리티 함수들
export const getUserRoleFromJwtSync = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;

  const decoded = parseJwt(token);
  return decoded?.role ?? null;
};

export const getCurrentUserFromTokenSync = (): JwtPayload | null => {
  const token = getAccessToken();
  if (!token) return null;

  return parseJwt(token);
};

export const isCurrentTokenExpiredSync = (): boolean => {
  const token = getAccessToken();
  return isTokenExpired(token || "");
};

export const getUserRoleFromJwt = (): string | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const decoded = parseJwt(token);
  return decoded?.role ?? null;
};

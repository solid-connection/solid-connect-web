import { UserRole } from "@/types/mentor";

import { getAccessToken } from "@/lib/zustand/useTokenStore";

interface JwtPayload {
  exp: number;
  role?: string;
  sub?: number; // 사용자 ID
  iat?: number; // 발급 시간
}

// 안전한 Base64URL 디코더 (브라우저/Node 양쪽 지원)
const base64UrlDecode = (input: string): string => {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = base64 + padding;

  if (typeof window !== "undefined" && typeof atob === "function") {
    const binary = atob(normalized);
    try {
      return decodeURIComponent(
        Array.prototype.map.call(binary, (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""),
      );
    } catch {
      return binary;
    }
  } else {
    return Buffer.from(normalized, "base64").toString("utf-8");
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true;
  }
  try {
    // JWT의 payload 부분을 디코딩합니다 (Base64URL 디코딩)
    const payload = JSON.parse(base64UrlDecode(token.split(".")[1])) as JwtPayload;

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
    const payload = JSON.parse(base64UrlDecode(token.split(".")[1])) as JwtPayload;
    const { exp } = payload;
    return exp * 1000; // → ms
  } catch {
    return 0;
  }
};

export const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = base64UrlDecode(base64Payload);
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

const toUserRole = (role: unknown): UserRole | null => {
  if (typeof role !== "string") return null;
  const upper = role.toUpperCase();
  return Object.values(UserRole).includes(upper as UserRole) ? (upper as UserRole) : null;
};

export const getUserRoleFromJwt = (): UserRole | null => {
  const token = getAccessToken();
  if (!token) return null;

  const decoded = parseJwt(token);
  return toUserRole(decoded?.role);
};

export const getUserIdFromJwt = (): number | null => {
  const token = getAccessToken();
  if (!token) return null;

  const decoded = parseJwt(token);

  return decoded?.sub ? Number(decoded.sub) : null;
};

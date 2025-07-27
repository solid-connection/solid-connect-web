import { cookies } from "next/headers";
// protectedFetch.ts
import { redirect } from "next/navigation";

import { decodeExp, isTokenExpired } from "./jwtUtils";

import { reissueAccessTokenPublicApi } from "@/api/auth";

const AUTH_EXPIRED = "AUTH_EXPIRED";
const TIME_LIMIT = 30 * 1000; // 30초

/** 커스텀 HTTP 에러: any 캐스팅 없이 status · body 보존 */
class HttpError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string) {
    super(`HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

/* ---------- 전역 캐시 ---------- */
interface AccessCache {
  token: string | null;
  exp: number; // ms
  refreshing: Promise<string> | null;
}
// 전역 객체에 캐시 추가
const globalSemaphore = globalThis as typeof globalThis & { __accessCache?: AccessCache };
// 값 초기화
if (!globalSemaphore.__accessCache) {
  globalSemaphore.__accessCache = { token: null, exp: 0, refreshing: null };
}
// 전역 캐시 객체
const accessCache: AccessCache = globalSemaphore.__accessCache;

const getAccessToken = async (refresh: string) => {
  // 만료 30초 전까지는 재발급하지 않고 캐싱
  if (accessCache.token && Date.now() < accessCache.exp - TIME_LIMIT) return accessCache.token;
  if (accessCache.refreshing) return accessCache.refreshing;

  accessCache.refreshing = reissueAccessTokenPublicApi(refresh)
    .then(({ data }) => {
      accessCache.token = data.accessToken;
      accessCache.exp = decodeExp(data.accessToken);
      accessCache.refreshing = null;
      return data.accessToken;
    })
    .catch((e) => {
      // 토큰 재발급 실패 시 캐시 전부 초기화
      accessCache.refreshing = null;
      accessCache.token = null;
      accessCache.exp = 0;
      throw e;
    });

  return accessCache.refreshing;
};

/* ---------- fetch 래퍼 ---------- */
type NextCacheOpt =
  | { revalidate?: number; tags?: string[] } // App Router 캐시 옵션
  | undefined;

interface ServerFetchOptions extends Omit<RequestInit, "body"> {
  /** 요청 바디.
   *  - 객체/배열 → JSON.stringify 후 `Content-Type: application/json`
   *  - string, Blob, FormData 등 → 그대로 전송
   */
  body?: unknown;
  /** 로그인 필요 여부 (기본 true) */
  isAuth?: boolean;
  /** Next.js 캐시 옵션 */
  next?: NextCacheOpt;
}

const BASE = process.env.NEXT_PUBLIC_API_SERVER_URL;
if (!BASE) {
  throw new Error("NEXT_PUBLIC_API_SERVER_URL is not defined");
}

/** SSR-only fetch (App Router) */
async function internalFetch<T = unknown>(
  input: string,
  { body, isAuth = false, next, headers, ...init }: ServerFetchOptions = {},
): Promise<T> {
  /* 쿠키 & 토큰 */
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value ?? null;
  let accessToken: string | null = null;

  if (isAuth) {
    if (!refreshToken || isTokenExpired(refreshToken)) throw new Error(AUTH_EXPIRED);
    accessToken = await getAccessToken(refreshToken);
  }

  /* 요청 헤더 구성 */
  const reqHeaders = new Headers(headers);
  if (accessToken) reqHeaders.set("Authorization", `Bearer ${accessToken}`);

  let requestBody: RequestInit["body"] = undefined;
  if (body !== undefined) {
    // JSON 직렬화 여부 판단
    if (typeof body === "string" || body instanceof Blob || body instanceof FormData || body instanceof ArrayBuffer) {
      requestBody = body as BodyInit;
    } else {
      reqHeaders.set("Content-Type", "application/json");
      requestBody = JSON.stringify(body);
    }
  }

  const response = await fetch(`${BASE}${input}`, {
    ...init,
    body: requestBody,
    headers: reqHeaders,
    credentials: "omit", // refresh 쿠키는 전달X 서버에서만 사용
    next, // revalidate / tags 옵션 그대로 전달
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new HttpError(response.status, errorBody);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  // JSON 이 아닌 경우 텍스트로 반환
  const textBody = await response.text();
  return textBody as unknown as T;
}

/** 옵션 객체 기반 Unified fetch */
async function serverFetch<T = unknown>(url: string, options: ServerFetchOptions = {}): Promise<T> {
  const { isAuth = false } = options;

  try {
    return await internalFetch<T>(url, options);
  } catch (e: unknown) {
    const err = e as Error;
    if (isAuth && err.message === AUTH_EXPIRED) {
      redirect(`/login?next=${url}`);
    }
    throw err;
  }
}

export default serverFetch;

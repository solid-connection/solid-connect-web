// src/utils/serverFetch.ts
import { cookies } from "next/headers";
// protectedFetch.ts
import { redirect } from "next/navigation";

import { isTokenExpired } from "./jwtUtils";

import { reissueAccessTokenPublicApi } from "@/api/auth";

const AUTH_EXPIRED = "AUTH_EXPIRED";

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

const decodeExp = (jwt: string) => {
  try {
    const { exp = 0 } = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString("utf8"));
    return exp * 1000; // → ms
  } catch {
    return 0;
  }
};
const getAccessToken = async (refresh: string) => {
  // 만료 이전 5초까지만 캐싱
  if (accessCache.token && Date.now() < accessCache.exp - 5000) return accessCache.token;
  if (accessCache.refreshing) return accessCache.refreshing;

  accessCache.refreshing = reissueAccessTokenPublicApi(refresh)
    .then(({ data }) => {
      accessCache.token = data.accessToken;
      accessCache.exp = decodeExp(data.accessToken);
      accessCache.refreshing = null;
      return data.accessToken;
    })
    .catch((e) => {
      accessCache.refreshing = null;
      throw e;
    });

  return accessCache.refreshing;
};

/* ---------- fetch 래퍼 ---------- */
type NextCacheOpt =
  | { revalidate?: number; tags?: string[] } // App Router 캐시 옵션
  | undefined;

interface ServerFetchOptions extends Omit<RequestInit, "body"> {
  /** JSON 바디를 넘기고 싶을 때 */
  json?: unknown;
  /** 로그인 필요 여부 (기본 true) */
  isAuth?: boolean;
  /** Next.js 캐시 옵션 */
  next?: NextCacheOpt;
}

const BASE = process.env.NEXT_PUBLIC_API_SERVER_URL!;

/** SSR-only fetch (App Router) */
async function internalFetch<T = unknown>(
  input: string,
  { json, isAuth = false, next, headers, ...init }: ServerFetchOptions = {},
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

  let body: RequestInit["body"] = undefined;
  if (json !== undefined) {
    reqHeaders.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }

  const response = await fetch(`${BASE}${input}`, {
    ...init,
    body,
    headers: reqHeaders,
    credentials: "omit", // refresh 쿠키는 전달X 서버에서만 사용
    next, // revalidate / tags 옵션 그대로 전달
  });

  if (!response.ok) throw new Error(`FETCH_ERROR_${response.status}`);
  // JSON 외 형식이 필요하면 호출부에서 Response 자체를 반환받도록 제네릭을 수정
  return response.json() as Promise<T>;
}

/** Unified fetch: (url, body, isAuth, otherOptions) */
async function serverFetch<T = unknown>(
  url: string,
  body?: unknown,
  isAuth: boolean = false,
  otherOptions: Omit<ServerFetchOptions, "json" | "auth"> = {},
): Promise<T> {
  try {
    return await internalFetch<T>(url, {
      ...otherOptions,
      json: body,
      isAuth: isAuth,
    });
  } catch (e: unknown) {
    const err = e as Error;
    if (isAuth && err.message === AUTH_EXPIRED) {
      redirect(`/login?next=${url}`);
    }
    throw err;
  }
}

export default serverFetch;

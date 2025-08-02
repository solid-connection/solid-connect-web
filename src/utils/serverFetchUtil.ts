import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// protectedFetch.ts
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

type ServerFetchSuccess<T> = { ok: true; status: number; data: T };
type ServerFetchFailure = { ok: false; status: number; error: string };
export type ServerFetchResult<T> = ServerFetchSuccess<T> | ServerFetchFailure;

/* ---------- 전역 캐시 ---------- */
interface AccessCacheItem {
  token: string | null;
  exp: number; // ms
  refreshing: Promise<string> | null;
  lastAccess: number; // 마지막 접근 시각
}

type AccessCacheMap = Record<string, AccessCacheItem>;

const MAX_CACHE_ENTRIES = 1000;
const CLEANUP_EVERY = 100; // getCache 호출 N회마다 정리
let _cleanupCounter = 0;

// 전역 객체에 캐시 맵 추가 (리프레시 토큰을 key 로 사용)
const globalSemaphore = globalThis as typeof globalThis & {
  __accessCacheMap?: AccessCacheMap;
};

if (!globalSemaphore.__accessCacheMap) {
  globalSemaphore.__accessCacheMap = {};
}

/** 필요 시 새로 할당하여 캐시 항목 반환 + 주기적 정리 */
const getCache = (refreshToken: string): AccessCacheItem => {
  const map = globalSemaphore.__accessCacheMap!;
  let item = map[refreshToken];
  if (!item) {
    item = { token: null, exp: 0, refreshing: null, lastAccess: Date.now() };
    map[refreshToken] = item;
  } else {
    item.lastAccess = Date.now();
  }

  // 주기적 캐시 정리
  if (++_cleanupCounter >= CLEANUP_EVERY && Object.keys(map).length > MAX_CACHE_ENTRIES) {
    _cleanupCounter = 0;
    const now = Date.now();
    for (const [key, value] of Object.entries(map)) {
      // 만료된 토큰이거나 1시간 이상 접근이 없으면 제거
      if (now - value.lastAccess > 60 * 60 * 1000 || now > value.exp + TIME_LIMIT) {
        delete map[key];
      }
    }
  }
  return item;
};

const getAccessToken = async (refresh: string) => {
  const cache = getCache(refresh);

  // 만료 30초 전까지는 재발급하지 않고 캐싱
  if (cache.token && Date.now() < cache.exp - TIME_LIMIT) return cache.token;
  if (cache.refreshing) return cache.refreshing;

  cache.refreshing = reissueAccessTokenPublicApi(refresh)
    .then(({ data }) => {
      cache.token = data.accessToken;
      cache.exp = decodeExp(data.accessToken);
      cache.refreshing = null;
      return data.accessToken;
    })
    .catch((e) => {
      // 토큰 재발급 실패 시 캐시 초기화
      cache.refreshing = null;
      // 실패한 토큰은 캐시에서 제거하여 메모리 누수 방지
      delete globalSemaphore.__accessCacheMap![refresh];
      throw e;
    });

  return cache.refreshing;
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
async function serverFetch<T = unknown>(url: string, options: ServerFetchOptions = {}): Promise<ServerFetchResult<T>> {
  const { isAuth = false } = options;

  try {
    const data = await internalFetch<T>(url, options);
    return { ok: true, status: 200, data };
  } catch (e: unknown) {
    // 중앙집중 인증 실패 처리 → 로그인 페이지로 리다이렉트
    if (isAuth && e instanceof HttpError && (e.status === 401 || e.status === 403)) {
      redirect(`/login?next=${encodeURIComponent(url)}`);
    }
    if (e instanceof HttpError) {
      return { ok: false, status: e.status, error: e.body };
    }
    const err = e as Error;
    // 예외 메시지 기반 토큰 만료 처리
    if (isAuth && err.message === AUTH_EXPIRED) {
      redirect(`/login?next=${encodeURIComponent(url)}`);
    }
    return { ok: false, status: 500, error: err.message ?? "Unknown error" };
  }
}

export default serverFetch;

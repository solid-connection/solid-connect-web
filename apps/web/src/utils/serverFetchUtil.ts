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
type ServerFetchFailure = { ok: false; status: number; error: string; data: undefined };
export type ServerFetchResult<T> = ServerFetchSuccess<T> | ServerFetchFailure;

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
  /** Next.js 캐시 옵션 */
  next?: NextCacheOpt;
}

const BASE = process.env.NEXT_PUBLIC_API_SERVER_URL;
if (!BASE) {
  throw new Error("NEXT_PUBLIC_API_SERVER_URL is not defined");
}

/** ISR 친화적 fetch - 인증 없는 공개 API만 지원 */
async function internalFetch<T = unknown>(
  input: string,
  { body, next, headers, ...init }: ServerFetchOptions = {},
): Promise<T> {
  /* 요청 헤더 구성 - 인증 제거 */
  const reqHeaders = new Headers(headers);

  let requestBody: RequestInit["body"];
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

/** ISR 친화적 공개 API 전용 fetch */
async function serverFetch<T = unknown>(url: string, options: ServerFetchOptions = {}): Promise<ServerFetchResult<T>> {
  try {
    const data = await internalFetch<T>(url, options);
    return { ok: true, status: 200, data };
  } catch (e: unknown) {
    if (e instanceof HttpError) {
      return { ok: false, status: e.status, error: e.body, data: undefined };
    }
    const err = e as Error;
    return { ok: false, status: 500, error: err.message ?? "Unknown error", data: undefined };
  }
}

export default serverFetch;

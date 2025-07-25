import { useCallback, useState } from "react";

import { AxiosRequestConfig } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

interface FetchResult<T> {
  data: T;
  status: number;
  message?: string;
}

interface UseFetchOptions extends Omit<AxiosRequestConfig, "url" | "data" | "method"> {
  /** HTTP 메서드 (기본 GET) */
  method?: AxiosRequestConfig["method"];
  /** 요청 바디 */
  body?: unknown;
  /** 즉시 요청 여부 (기본 true) */
  enabled?: boolean;
}

const useFetch = <T = unknown>(
  url: string,
  { method = "get", body, headers, params, ...rest }: UseFetchOptions = {},
) => {
  const [result, setResult] = useState<FetchResult<T> | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (
      reqMethod: AxiosRequestConfig["method"] = method,
      reqUrl: string = url,
      reqBody: unknown = body,
      isToken = true,
    ) => {
      setLoading(true);
      try {
        const reqHeaders = { ...headers };
        if (!isToken && reqHeaders && "Authorization" in reqHeaders) {
          delete reqHeaders.Authorization;
        }

        const { data: resData, status } = await axiosInstance.request<T>({
          url: reqUrl,
          method: reqMethod,
          data: reqBody,
          headers: reqHeaders,
          params,
          ...rest,
        });
        let message = "";
        if (resData && typeof resData === "object" && "message" in (resData as Record<string, unknown>)) {
          message = (resData as { message?: string }).message ?? "";
        }
        setResult({ data: resData, status, message });
        setError(null);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url, method, JSON.stringify(headers), JSON.stringify(params), JSON.stringify(rest)],
  );

  return { result, error, loading, fetchData };
};

export default useFetch;

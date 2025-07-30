import { useCallback, useState } from "react";

import { AxiosRequestConfig } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

interface FetchResult<T> {
  data: T;
  status: number;
  message?: string;
}

interface FetchParams {
  method: AxiosRequestConfig["method"];
  url: string;
  body: unknown;
  isToken: boolean;
}

const useFetch = <T = unknown>() => {
  const [result, setResult] = useState<FetchResult<T> | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async ({ method = "GET", url, body, isToken = true }: FetchParams) => {
    setLoading(true);
    try {
      const reqHeaders: Record<string, string> = {};
      if (isToken) {
        // Authorization header가 이미 axiosInstance interceptor에서 처리됨
      }

      const axiosConfig: AxiosRequestConfig = {
        url,
        method,
        data: body,
      };
      if (Object.keys(reqHeaders).length) {
        axiosConfig.headers = reqHeaders;
      }

      const { data: resData, status } = await axiosInstance.request<T>(axiosConfig);
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
  }, []);

  return { result, error, loading, fetchData };
};

export default useFetch;

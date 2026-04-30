import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-hot-toast";

type ErrorResponse = {
  message?: string;
};

const DEFAULT_ERROR_MESSAGE = "오류가 발생했습니다. 다시 시도해주세요.";

const isUnauthorized = (status?: number) => status === 401;

const resolveErrorMessage = (error: AxiosError<ErrorResponse>) =>
  error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE;

const buildToastId = (status: number | undefined, message: string) =>
  `rq-error:${status ?? "unknown"}:${message.trim().toLowerCase()}`;

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const status = axiosError?.response?.status;
      if (isUnauthorized(status)) return;

      const errorMessage = resolveErrorMessage(axiosError);
      toast.error(errorMessage, {
        id: buildToastId(status, errorMessage),
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const status = axiosError?.response?.status;

      // 인증 오류는 인터셉터 리다이렉트 토스트에서만 처리
      if (isUnauthorized(status)) return;

      const errorMessage = resolveErrorMessage(axiosError);
      toast.error(errorMessage, {
        id: buildToastId(status, errorMessage),
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 데이터 신선도(5분)
      gcTime: 30 * 60 * 1000, // 캐시 보존시간(30분)
      retry: (failureCount, error) => {
        const status = (error as AxiosError | undefined)?.response?.status;
        if (status === 401) return false; // 인증 오류는 재시도 X
        return failureCount < 1; // 그 외에는 최대 1회까지 재시도
      },
      refetchOnWindowFocus: false, // 창 포커스 복귀 시 refetch 비활성
    },
  },
});

export default queryClient;

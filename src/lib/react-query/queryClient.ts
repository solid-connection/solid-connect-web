import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "@/lib/zustand/useToastStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 데이터 신선도(5분)
      gcTime: 30 * 60 * 1000, // 캐시 보존시간(30분)
      retry: (failureCount, error) => {
        const status = (error as AxiosError | undefined)?.response?.status;
        if (status === 401) return false; // 인증 오류는 재시도 X
        return failureCount < 3; // 그 외에는 최대 3회까지 재시도
      },
      refetchOnWindowFocus: false, // 창 포커스 복귀 시 refetch 비활성
    },
    mutations: {
      onError: (error) => {
        // mutation 실패 시 전역 에러 토스트
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError?.response?.data?.message || axiosError?.message || "오류가 발생했습니다. 다시 시도해주세요.";
        toast.error(errorMessage);
      },
    },
  },
});

export default queryClient;

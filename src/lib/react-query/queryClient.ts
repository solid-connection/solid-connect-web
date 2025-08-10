import type { AxiosError } from "axios";

import { QueryClient } from "@tanstack/react-query";

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
  },
});

export default queryClient;

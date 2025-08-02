import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 데이터 신선도(5분)
      gcTime: 30 * 60 * 1000, // 캐시 보존시간(30분)
      retry: 2, // 요청 실패 시 재시도 2회
      refetchOnWindowFocus: false, // 창 포커스 복귀 시 refetch 비활성
    },
  },
});

export default queryClient;

import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import type { MentoringNewCountResponse } from "../type/response";

import { useQuery } from "@tanstack/react-query";

const getMentoringNewCount = async ({
  queryKey,
}: {
  queryKey: [string, boolean];
}): Promise<MentoringNewCountResponse> => {
  const [, isLogin] = queryKey;
  const endpoint = "/mentorings/check";

  const instance = isLogin ? axiosInstance : publicAxiosInstance;
  const res = await instance.get(endpoint);
  return res.data;
};

// ISR 의도(10분) 유지: staleTime 10분
const useGetMentoringNewCount = (isLogin: boolean) =>
  useQuery({
    queryKey: ["mentoring-new-count", isLogin],
    queryFn: getMentoringNewCount,
    enabled: isLogin,
    refetchInterval: 1000 * 60 * 10, // ⏱️ 10분마다 자동 재요청
    refetchOnWindowFocus: true, // 탭 돌아올 때도 최신화
    staleTime: 1000 * 60 * 5, // fresh 상태 유지
  });

export default useGetMentoringNewCount;

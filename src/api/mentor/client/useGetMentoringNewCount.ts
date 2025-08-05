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
    enabled: isLogin, // 로그인 상태일 때만 활성화
    staleTime: 1000 * 60 * 10,
  });

export default useGetMentoringNewCount;

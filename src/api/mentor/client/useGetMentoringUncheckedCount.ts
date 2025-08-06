import { axiosInstance } from "@/utils/axiosInstance";

import { queryKey } from "./queryKey";

import { useQuery } from "@tanstack/react-query";

interface GetMentoringNewCountResponse {
  uncheckedCount: number; // 멘토링 신규 요청 수
}

const getMentoringUncheckedCount = async (): Promise<GetMentoringNewCountResponse> => {
  const endpoint = "/mentorings/check";
  const res = await axiosInstance.get<GetMentoringNewCountResponse>(endpoint);
  return res.data;
};

// ISR 의도(10분) 유지: staleTime 10분
const useGetMentoringUncheckedCount = (isEnable: boolean) =>
  useQuery({
    queryKey: [queryKey.mentoringNewCount],
    queryFn: getMentoringUncheckedCount,
    enabled: isEnable,
    refetchInterval: 1000 * 60 * 10, // ⏱️ 10분마다 자동 재요청
    refetchOnWindowFocus: true, // 탭 돌아올 때도 최신화
    staleTime: 1000 * 60 * 5, // fresh 상태 유지
    select: (data) => data.uncheckedCount, // 필요한 데이터만 반환
  });

export default useGetMentoringUncheckedCount;

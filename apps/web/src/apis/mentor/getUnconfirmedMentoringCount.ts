import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type GetMentoringNewCountResponse, MentorQueryKeys, mentorApi } from "./api";

const useGetUnconfirmedMentoringCount = (enabled: boolean = true) => {
  return useQuery<GetMentoringNewCountResponse, AxiosError, number>({
    queryKey: [MentorQueryKeys.mentoringNewCount],
    queryFn: mentorApi.getMentoringUncheckedCount,
    enabled,
    refetchInterval: 1000 * 60 * 10, // ⏱️ 10분마다 자동 재요청
    staleTime: 1000 * 60 * 5, // fresh 상태 유지
    select: (data) => data.uncheckedCount,
  });
};

export default useGetUnconfirmedMentoringCount;

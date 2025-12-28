import { AxiosError } from "axios";

import { GetMentoringNewCountResponse, MentorQueryKeys, mentorApi } from "./api";

import { useQuery } from "@tanstack/react-query";

/**
 * @description 미확인 멘토링 수 조회 훅
 */
const useGetMentoringUncheckedCount = (isEnable: boolean) => {
  return useQuery<GetMentoringNewCountResponse, AxiosError, number>({
    queryKey: [MentorQueryKeys.mentoringNewCount],
    queryFn: mentorApi.getMentoringUncheckedCount,
    enabled: isEnable,
    refetchInterval: 1000 * 60 * 10, // ⏱️ 10분마다 자동 재요청
    staleTime: 1000 * 60 * 5, // fresh 상태 유지
    select: (data) => data.uncheckedCount,
  });
};

export default useGetMentoringUncheckedCount;

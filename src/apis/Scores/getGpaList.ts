import { AxiosError } from "axios";

import { ScoresQueryKeys, scoresApi } from "./api";

import { GpaScore } from "@/types/score";

import { useQuery } from "@tanstack/react-query";

/**
 * @description 내 학점 점수 조회 훅
 */
const useGetMyGpaScore = () => {
  return useQuery({
    queryKey: [ScoresQueryKeys.myGpaScore],
    queryFn: scoresApi.getMyGpaScore,
    staleTime: Infinity,
    select: (data) => data.data.gpaScoreStatusResponseList,
  });
};

export default useGetMyGpaScore;

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { ScoresQueryKeys, scoresApi, type UseMyGpaScoreResponse } from "./api";

type UseGetMyGpaScoreOptions = Omit<
  UseQueryOptions<AxiosResponse<UseMyGpaScoreResponse>, unknown, UseMyGpaScoreResponse>,
  "queryKey" | "queryFn"
>;

/**
 * @description 내 학점 점수 조회 훅
 */
const useGetMyGpaScore = (props?: UseGetMyGpaScoreOptions) => {
  return useQuery({
    queryKey: [ScoresQueryKeys.myGpaScore],
    queryFn: scoresApi.getMyGpaScore,
    enabled: true,
    staleTime: Infinity,
    select: (data) => data.data,
    ...props,
  });
};

export default useGetMyGpaScore;

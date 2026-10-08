import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import type { LanguageTestScore } from "@/types/score";
import { ScoresQueryKeys, scoresApi, type UseGetMyLanguageTestScoreResponse } from "./api";

type UseGetMyLanguageTestScoreOptions = Omit<
  UseQueryOptions<AxiosResponse<UseGetMyLanguageTestScoreResponse>, unknown, LanguageTestScore[]>,
  "queryKey" | "queryFn"
>;

/**
 * @description 내 어학 점수 조회 훅
 */
const useGetMyLanguageTestScore = (props?: UseGetMyLanguageTestScoreOptions) => {
  return useQuery({
    queryKey: [ScoresQueryKeys.myLanguageTestScore],
    queryFn: scoresApi.getMyLanguageTestScore,
    enabled: true,
    staleTime: Infinity,
    select: (data) => data.data.languageTestScoreStatusResponseList,
    ...props,
  });
};

export default useGetMyLanguageTestScore;

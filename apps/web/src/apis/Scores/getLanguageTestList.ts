import { useQuery } from "@tanstack/react-query";

import { ScoresQueryKeys, scoresApi } from "./api";

/**
 * @description 내 어학 점수 조회 훅
 */
const useGetMyLanguageTestScore = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: [ScoresQueryKeys.myLanguageTestScore],
    queryFn: scoresApi.getMyLanguageTestScore,
    enabled,
    staleTime: Infinity,
    select: (data) => data.data.languageTestScoreStatusResponseList,
  });
};

export default useGetMyLanguageTestScore;

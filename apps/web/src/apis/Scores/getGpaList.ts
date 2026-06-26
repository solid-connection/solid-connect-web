import { useQuery } from "@tanstack/react-query";

import { ScoresQueryKeys, scoresApi } from "./api";

/**
 * @description 내 학점 점수 조회 훅
 */
const useGetMyGpaScore = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: [ScoresQueryKeys.myGpaScore],
    queryFn: scoresApi.getMyGpaScore,
    enabled,
    staleTime: Infinity,
    select: (data) => data.data,
  });
};

export default useGetMyGpaScore;

import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { scoresApi, ScoresQueryKeys } from "./api";
import { GpaScore } from "@/types/score";

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
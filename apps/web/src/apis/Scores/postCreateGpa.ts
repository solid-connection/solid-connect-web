import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import { ScoresQueryKeys, scoresApi, type UsePostGpaScoreRequest } from "./api";

/**
 * @description 학점 점수 제출 훅
 */
export const usePostGpaScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UsePostGpaScoreRequest) => scoresApi.postGpaScore(request),

    onSuccess: () => {
      toast.success("학점 정보가 성공적으로 제출되었습니다.");
      queryClient.invalidateQueries({ queryKey: [ScoresQueryKeys.myGpaScore] });
    },
  });
};

export default usePostGpaScore;

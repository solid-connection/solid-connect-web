import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/lib/zustand/useToastStore";
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

    onError: (error) => {
      console.error("학점 제출 중 오류 발생:", error);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostGpaScore;

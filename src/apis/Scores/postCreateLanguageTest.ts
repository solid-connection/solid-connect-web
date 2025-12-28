import { AxiosError } from "axios";

import { ScoresQueryKeys, UsePostLanguageTestScoreRequest, scoresApi } from "./api";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * @description 어학 점수 제출 훅
 */
export const usePostLanguageTestScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UsePostLanguageTestScoreRequest) => scoresApi.postLanguageTestScore(request),

    onSuccess: () => {
      toast.success("어학 성적이 성공적으로 제출되었습니다.");
      queryClient.invalidateQueries({ queryKey: [ScoresQueryKeys.myLanguageTestScore] });
    },

    onError: (error) => {
      console.error("어학 성적 제출 중 오류 발생:", error);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostLanguageTestScore;

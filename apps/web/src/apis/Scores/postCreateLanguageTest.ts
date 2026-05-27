import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showIconToast } from "@/lib/toast/showIconToast";
import { ScoresQueryKeys, scoresApi, type UsePostLanguageTestScoreRequest } from "./api";

/**
 * @description 어학 점수 제출 훅
 */
export const usePostLanguageTestScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UsePostLanguageTestScoreRequest) => scoresApi.postLanguageTestScore(request),

    onSuccess: () => {
      showIconToast("logo", "어학 성적이 성공적으로 제출되었습니다.");
      queryClient.invalidateQueries({ queryKey: [ScoresQueryKeys.myLanguageTestScore] });
    },
  });
};

export default usePostLanguageTestScore;

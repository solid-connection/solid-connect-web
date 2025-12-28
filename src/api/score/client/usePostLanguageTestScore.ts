import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

// 예시: 성공 후 페이지 이동
import { QueryKeys } from "./queryKey";

import { LanguageTestEnum } from "@/types/score";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// QueryKeys가 정의된 경로로 수정해주세요.

interface UsePostLanguageTestScoreRequest {
  languageTestScoreRequest: {
    languageTestType: LanguageTestEnum;
    languageTestScore: string;
    issueDate: string; // yyyy-MM-dd
  };
  file: File;
}

export const postLanguageTestScore = (request: UsePostLanguageTestScoreRequest): Promise<AxiosResponse<null>> => {
  const convertedRequest: FormData = new FormData();
  convertedRequest.append(
    "languageTestScoreRequest",
    new Blob([JSON.stringify(request.languageTestScoreRequest)], { type: "application/json" }),
  );
  convertedRequest.append("file", request.file);
  return axiosInstance.post("/scores/language-tests", convertedRequest);
};
/**
 * 공인 어학 점수를 제출(POST)하기 위한 useMutation 훅입니다.
 */
export const usePostLanguageTestScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UsePostLanguageTestScoreRequest) => postLanguageTestScore(request),

    onSuccess: () => {
      toast.success("어학 성적이 성공적으로 제출되었습니다.");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.myLanguageTestScore] });
    },

    onError: (error) => {
      console.error("어학 성적 제출 중 오류 발생:", error);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

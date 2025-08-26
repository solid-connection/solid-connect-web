import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

// 예시: 성공 후 페이지 이동
import { QueryKeys } from "./queryKey";

import { LanguageTestEnum } from "@/types/score";

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
  return axiosInstance.post("/scores/language-tests", convertedRequest, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
/**
 * 공인 어학 점수를 제출(POST)하기 위한 useMutation 훅입니다.
 */
export const usePostLanguageTestScore = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (request: UsePostLanguageTestScoreRequest) => postLanguageTestScore(request),

    onSuccess: () => {
      alert("어학 성적이 성공적으로 제출되었습니다.");

      // 성공 후, 'myLanguageTestScore' 쿼리의 캐시를 무효화하여
      // useGetMyLanguageTestScore 훅이 최신 데이터를 다시 불러오도록 합니다.
      queryClient.invalidateQueries({ queryKey: [QueryKeys.myLanguageTestScore] });

      // 예시: 성공 후 특정 페이지로 이동
      // router.push("/my-page/language-scores");
    },

    onError: (error) => {
      console.error("어학 성적 제출 중 오류 발생:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

// API 함수 경로
export interface UseSubmitApplicationResponse {
  isSuccess: boolean;
}

export interface UseSubmitApplicationRequest {
  gpaScoreId: number;
  languageTestScoreId: number;
  universityChoiceRequest: {
    firstChoiceUniversityId: number | null;
    secondChoiceUniversityId: number | null;
    thirdChoiceUniversityId: number | null;
  };
}

export const postSubmitApplication = (
  request: UseSubmitApplicationRequest,
): Promise<AxiosResponse<UseSubmitApplicationResponse>> => axiosInstance.post("/applications", request);

// 타입 경로

const usePostSubmitApplication = () => {
  return useMutation({
    // mutationFn: API 요청을 수행할 비동기 함수를 지정합니다.
    mutationFn: (request: UseSubmitApplicationRequest) => postSubmitApplication(request),

    // onSuccess: API 요청이 성공했을 때 실행할 콜백 함수입니다.
    onSuccess: (data) => {
      console.log("지원이 성공적으로 완료되었습니다.", data);
    },

    // onError: API 요청이 실패했을 때 실행할 콜백 함수입니다.
    onError: (error) => {
      console.error("지원 중 오류가 발생했습니다.", error);
      alert("지원 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostSubmitApplication;

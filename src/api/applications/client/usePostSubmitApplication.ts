import { useRouter } from "next/navigation";

import { AxiosError, AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";
import { toast } from "@/lib/zustand/useToastStore";
// 타입 경로
import { UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { toast } from "@/lib/zustand/useToastStore";

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

const usePostSubmitApplication = (
  props?: UseMutationOptions<
    AxiosResponse<UseSubmitApplicationResponse>, // TData
    AxiosError<{ message: string }>, // TError
    UseSubmitApplicationRequest, // TVariables
    unknown // TContext
  >,
): UseMutationResult<
  AxiosResponse<UseSubmitApplicationResponse>,
  AxiosError<{ message: string }>,
  UseSubmitApplicationRequest,
  unknown
> => {
  return useMutation<
    AxiosResponse<UseSubmitApplicationResponse>, // TData: 성공 시 반환 타입
    AxiosError<{ message: string }>, // TError: 에러 타입
    UseSubmitApplicationRequest // TVariables: 요청 body 타입
  >({
    ...props,
    // mutationFn: API 요청을 수행할 비동기 함수를 지정합니다.
    mutationFn: (request: UseSubmitApplicationRequest) => postSubmitApplication(request),

    // onError: API 요청이 실패했을 때 실행할 콜백 함수입니다.
    onError: (error) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage || "지원 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostSubmitApplication;

import { AxiosError, AxiosResponse } from "axios";

import { UseSubmitApplicationRequest, UseSubmitApplicationResponse, applicationsApi } from "./api";

import { toast } from "@/lib/zustand/useToastStore";
import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";

/**
 * @description 지원 제출 훅
 */
const usePostSubmitApplication = (
  props?: UseMutationOptions<
    AxiosResponse<UseSubmitApplicationResponse>,
    AxiosError<{ message: string }>,
    UseSubmitApplicationRequest,
    unknown
  >,
): UseMutationResult<
  AxiosResponse<UseSubmitApplicationResponse>,
  AxiosError<{ message: string }>,
  UseSubmitApplicationRequest,
  unknown
> => {
  return useMutation<
    AxiosResponse<UseSubmitApplicationResponse>,
    AxiosError<{ message: string }>,
    UseSubmitApplicationRequest
  >({
    ...props,
    mutationFn: applicationsApi.postSubmitApplication,
    onError: (error) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage || "지원 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostSubmitApplication;

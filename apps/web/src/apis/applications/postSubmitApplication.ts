import { type UseMutationOptions, type UseMutationResult, useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { applicationsApi, type UseSubmitApplicationRequest, type UseSubmitApplicationResponse } from "./api";

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
  });
};

export default usePostSubmitApplication;

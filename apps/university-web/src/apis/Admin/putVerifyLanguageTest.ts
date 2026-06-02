import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { adminApi, type VerifyLanguageTestRequest, type VerifyLanguageTestResponse } from "./api";

const usePutVerifyLanguageTest = () => {
  return useMutation<
    VerifyLanguageTestResponse,
    AxiosError,
    { languageTestScoreId: string | number; data: VerifyLanguageTestRequest }
  >({
    mutationFn: (variables) => adminApi.putVerifyLanguageTest(variables),
  });
};

export default usePutVerifyLanguageTest;

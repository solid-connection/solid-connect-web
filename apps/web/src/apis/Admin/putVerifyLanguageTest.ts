import { AxiosError } from "axios";

import { VerifyLanguageTestRequest, VerifyLanguageTestResponse, adminApi } from "./api";

import { useMutation } from "@tanstack/react-query";

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

import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { adminApi, VerifyLanguageTestResponse, VerifyLanguageTestRequest } from "./api";

const usePutVerifyLanguageTest = () => {
  return useMutation<VerifyLanguageTestResponse, AxiosError, { languageTestScoreId: string | number; data: VerifyLanguageTestRequest }>({
    mutationFn: (variables) => adminApi.putVerifyLanguageTest(variables),
  });
};

export default usePutVerifyLanguageTest;
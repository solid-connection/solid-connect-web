import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { adminApi, type VerifyGpaRequest, type VerifyGpaResponse } from "./api";

const usePutVerifyGpa = () => {
  return useMutation<VerifyGpaResponse, AxiosError, { gpaScoreId: string | number; data: VerifyGpaRequest }>({
    mutationFn: (variables) => adminApi.putVerifyGpa(variables),
  });
};

export default usePutVerifyGpa;

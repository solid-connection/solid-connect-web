import { AxiosError } from "axios";

import { VerifyGpaRequest, VerifyGpaResponse, adminApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePutVerifyGpa = () => {
  return useMutation<VerifyGpaResponse, AxiosError, { gpaScoreId: string | number; data: VerifyGpaRequest }>({
    mutationFn: (variables) => adminApi.putVerifyGpa(variables),
  });
};

export default usePutVerifyGpa;

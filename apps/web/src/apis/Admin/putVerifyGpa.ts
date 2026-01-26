import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { adminApi, VerifyGpaResponse, VerifyGpaRequest } from "./api";

const usePutVerifyGpa = () => {
  return useMutation<VerifyGpaResponse, AxiosError, { gpaScoreId: string | number; data: VerifyGpaRequest }>({
    mutationFn: (variables) => adminApi.putVerifyGpa(variables),
  });
};

export default usePutVerifyGpa;
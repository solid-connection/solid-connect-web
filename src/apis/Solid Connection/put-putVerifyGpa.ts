import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PutVerifyGpaRequest {
  // TODO: Define request type
}

export interface PutVerifyGpaResponse {
  id: number;
  gpa: number;
  gpaCriteria: number;
  verifyStatus: string;
  rejectedReason: null;
}

const putVerifyGpa = async (params: { data?: PutVerifyGpaRequest }): Promise<PutVerifyGpaResponse> => {
  const res = await axiosInstance.put<PutVerifyGpaResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePutVerifyGpa = () => {
  return useMutation<PutVerifyGpaResponse, AxiosError, PutVerifyGpaRequest>({
    mutationFn: (data) => putVerifyGpa({ data }),
  });
};

export default usePutVerifyGpa;
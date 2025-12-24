import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PutVerifyLanguageTestRequest {
  // TODO: Define request type
}

export interface PutVerifyLanguageTestResponse {
  id: number;
  languageTestType: string;
  languageTestScore: string;
  verifyStatus: string;
  rejectedReason: null;
}

const putVerifyLanguageTest = async (params: { data?: PutVerifyLanguageTestRequest }): Promise<PutVerifyLanguageTestResponse> => {
  const res = await axiosInstance.put<PutVerifyLanguageTestResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePutVerifyLanguageTest = () => {
  return useMutation<PutVerifyLanguageTestResponse, AxiosError, PutVerifyLanguageTestRequest>({
    mutationFn: (data) => putVerifyLanguageTest({ data }),
  });
};

export default usePutVerifyLanguageTest;
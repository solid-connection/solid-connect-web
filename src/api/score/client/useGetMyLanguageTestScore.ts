import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { LanguageTestScore } from "@/types/score";

import { useQuery } from "@tanstack/react-query";

interface UseGetMyLanguageTestScoreResponse {
  languageTestScoreStatusResponseList: LanguageTestScore[];
}

export const getMyLanguageTestScore = (): Promise<AxiosResponse<UseGetMyLanguageTestScoreResponse>> =>
  axiosInstance.get("/scores/language-tests");

const useGetMyLanguageTestScore = () => {
  return useQuery({
    queryKey: [QueryKeys.myLanguageTestScore],
    queryFn: getMyLanguageTestScore,
    staleTime: Infinity,
    select: (data) => data.data.languageTestScoreStatusResponseList,
  });
};

export default useGetMyLanguageTestScore;

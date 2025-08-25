import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { GpaScore } from "@/types/score";

import { useQuery } from "@tanstack/react-query";

interface UseMyGpaScoreResponse {
  gpaScoreStatusResponseList: GpaScore[];
}

export const getMyGpaScore = (): Promise<AxiosResponse<UseMyGpaScoreResponse>> => axiosInstance.get("/scores/gpas");

const useGetMyGpaScore = () => {
  return useQuery({
    queryKey: [QueryKeys.myGpaScore],
    queryFn: getMyGpaScore,
    staleTime: Infinity, // 5분간 캐시
    select: (data) => data.data.gpaScoreStatusResponseList,
  });
};

export default useGetMyGpaScore;

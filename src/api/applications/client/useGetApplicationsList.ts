import { AxiosError, AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKeys";

import { ApplicationListResponse } from "@/types/application";

// UseQueryResult는 useQuery의 반환 타입을 명시할 때 유용합니다.
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";

export const getCompetitorsApplicationList = (): Promise<AxiosResponse<ApplicationListResponse>> =>
  axiosInstance.get("/applications");

// 커스텀 훅의 props 타입 정의를 개선하여 queryKey와 queryFn을 제외시킵니다.
type UseGetCompetitorsApplicationListOptions = Omit<
  UseQueryOptions<
    AxiosResponse<ApplicationListResponse>, // queryFn이 반환하는 원본 데이터 타입
    AxiosError<{ message: string }>, // 에러 타입
    ApplicationListResponse // select를 통해 최종적으로 반환될 데이터 타입
  >,
  "queryKey" | "queryFn" // 훅 내부에서 지정하므로 props에서는 제외
>;

const useGetApplicationsList = (
  props?: UseGetCompetitorsApplicationListOptions,
): UseQueryResult<ApplicationListResponse, AxiosError<{ message: string }>> => {
  // 반환 타입 명시
  return useQuery({
    queryKey: [QueryKeys.competitorsApplicationList],
    queryFn: getCompetitorsApplicationList,
    staleTime: 1000 * 60 * 5,
    select: (response) => response.data,
    ...props,
  });
};

export default useGetApplicationsList;

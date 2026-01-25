import { type UseQueryOptions, type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import type { ApplicationListResponse } from "@/types/application";
import { ApplicationsQueryKeys, applicationsApi } from "./api";

type UseGetApplicationsListOptions = Omit<
  UseQueryOptions<AxiosResponse<ApplicationListResponse>, AxiosError<{ message: string }>, ApplicationListResponse>,
  "queryKey" | "queryFn"
>;

/**
 * @description 지원 목록 조회 훅
 */
const useGetApplicationsList = (
  props?: UseGetApplicationsListOptions,
): UseQueryResult<ApplicationListResponse, AxiosError<{ message: string }>> => {
  return useQuery({
    queryKey: [ApplicationsQueryKeys.competitorsApplicationList],
    queryFn: applicationsApi.getApplicationsList,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (response) => response.data,
    ...props,
  });
};

export default useGetApplicationsList;

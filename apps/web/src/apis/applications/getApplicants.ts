import { type UseQueryOptions, type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import type { ApplicationListResponse } from "@/types/application";
import { QueryKeys } from "../queryKeys";
import { type ApplicantsSearchParams, applicationsApi } from "./api";

type UseGetApplicationsListOptions = Omit<
  UseQueryOptions<AxiosResponse<ApplicationListResponse>, AxiosError<{ message: string }>, ApplicationListResponse>,
  "queryKey" | "queryFn"
>;

const useGetApplicationsList = (
  params?: ApplicantsSearchParams,
  props?: UseGetApplicationsListOptions,
): UseQueryResult<ApplicationListResponse, AxiosError<{ message: string }>> => {
  return useQuery({
    queryKey: [QueryKeys.applications.applicants, params],
    queryFn: () => applicationsApi.getApplicationsList(params),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (response) => response.data,
    ...props,
  });
};

export default useGetApplicationsList;

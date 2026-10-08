import { type UseQueryOptions, type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApplicationListResponse } from "@/types/application";
import { QueryKeys } from "../queryKeys";
import { applicationsApi } from "./api";

type UseGetCompetitorsOptions = Omit<
  UseQueryOptions<AxiosResponse<ApplicationListResponse>, AxiosError<{ message: string }>, ApplicationListResponse>,
  "queryKey" | "queryFn"
>;

const useGetCompetitors = (
  props?: UseGetCompetitorsOptions,
): UseQueryResult<ApplicationListResponse, AxiosError<{ message: string }>> => {
  return useQuery<AxiosResponse<ApplicationListResponse>, AxiosError<{ message: string }>, ApplicationListResponse>({
    queryKey: [QueryKeys.applications.competitors],
    queryFn: applicationsApi.getCompetitors,
    select: (response) => response.data,
    ...props,
  });
};

export default useGetCompetitors;

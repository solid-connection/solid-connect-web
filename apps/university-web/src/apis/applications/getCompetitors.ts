import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { applicationsApi, type CompetitorsResponse } from "./api";

const useGetCompetitors = (params?: Record<string, unknown>) => {
  return useQuery<CompetitorsResponse, AxiosError>({
    queryKey: [QueryKeys.applications.competitors, params],
    queryFn: () => applicationsApi.getCompetitors(params ? { params } : {}),
  });
};

export default useGetCompetitors;

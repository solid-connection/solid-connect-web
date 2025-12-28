import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { applicationsApi, CompetitorsResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetCompetitors = (params?: Record<string, any>) => {
  return useQuery<CompetitorsResponse, AxiosError>({
    queryKey: [QueryKeys.applications.competitors, params],
    queryFn: () => applicationsApi.getCompetitors(params ? { params } : {}),
  });
};

export default useGetCompetitors;
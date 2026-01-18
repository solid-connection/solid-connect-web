import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { CompetitorsResponse, applicationsApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetCompetitors = (params?: Record<string, any>) => {
  return useQuery<CompetitorsResponse, AxiosError>({
    queryKey: [QueryKeys.applications.competitors, params],
    queryFn: () => applicationsApi.getCompetitors(params ? { params } : {}),
  });
};

export default useGetCompetitors;

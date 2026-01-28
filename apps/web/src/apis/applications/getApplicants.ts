import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { applicationsApi, ApplicantsResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetApplicants = (params?: Record<string, any>) => {
  return useQuery<ApplicantsResponse, AxiosError>({
    queryKey: [QueryKeys.applications.applicants, params],
    queryFn: () => applicationsApi.getApplicants(params ? { params } : {}),
  });
};

export default useGetApplicants;
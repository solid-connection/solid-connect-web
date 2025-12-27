import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { universitiesApi, SearchFilterResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetSearchFilter = (params?: Record<string, any>) => {
  return useQuery<SearchFilterResponse, AxiosError>({
    queryKey: [QueryKeys.universities.searchFilter, params],
    queryFn: () => universitiesApi.getSearchFilter(params ? { params } : {}),
  });
};

export default useGetSearchFilter;
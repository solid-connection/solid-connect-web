import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { universitiesApi, SearchTextResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetSearchText = (params?: Record<string, any>) => {
  return useQuery<SearchTextResponse, AxiosError>({
    queryKey: [QueryKeys.universities.searchText, params],
    queryFn: () => universitiesApi.getSearchText(params ? { params } : {}),
  });
};

export default useGetSearchText;
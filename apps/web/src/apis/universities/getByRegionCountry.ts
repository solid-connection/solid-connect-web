import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { universitiesApi, ByRegionCountryResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetByRegionCountry = (params?: Record<string, any>) => {
  return useQuery<ByRegionCountryResponse, AxiosError>({
    queryKey: [QueryKeys.universities.byRegionCountry, params],
    queryFn: () => universitiesApi.getByRegionCountry(params ? { params } : {}),
  });
};

export default useGetByRegionCountry;
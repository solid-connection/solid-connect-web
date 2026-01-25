import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { type ByRegionCountryResponse, universitiesApi } from "./api";

const useGetByRegionCountry = (params?: Record<string, any>) => {
  return useQuery<ByRegionCountryResponse, AxiosError>({
    queryKey: [QueryKeys.universities.byRegionCountry, params],
    queryFn: () => universitiesApi.getByRegionCountry(params ? { params } : {}),
  });
};

export default useGetByRegionCountry;

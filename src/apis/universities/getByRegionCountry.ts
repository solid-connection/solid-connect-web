import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { ByRegionCountryResponse, universitiesApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetByRegionCountry = (params?: Record<string, any>) => {
  return useQuery<ByRegionCountryResponse, AxiosError>({
    queryKey: [QueryKeys.universities.byRegionCountry, params],
    queryFn: () => universitiesApi.getByRegionCountry(params ? { params } : {}),
  });
};

export default useGetByRegionCountry;

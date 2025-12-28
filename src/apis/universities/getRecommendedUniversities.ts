import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { universitiesApi, RecommendedUniversitiesResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetRecommendedUniversities = (params?: Record<string, any>) => {
  return useQuery<RecommendedUniversitiesResponse, AxiosError>({
    queryKey: [QueryKeys.universities.recommendedUniversities, params],
    queryFn: () => universitiesApi.getRecommendedUniversities(params ? { params } : {}),
  });
};

export default useGetRecommendedUniversities;
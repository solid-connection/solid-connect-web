import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface RecommendedUniversitiesItem {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: LanguageRequirementsItem[];
}

export interface LanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface GetRecommendedUniversitiesResponse {
  recommendedUniversities: RecommendedUniversitiesItem[];
}

const getRecommendedUniversities = async (params: { params?: Record<string, any> }): Promise<GetRecommendedUniversitiesResponse> => {
  const res = await axiosInstance.get<GetRecommendedUniversitiesResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetRecommendedUniversities = (params?: Record<string, any>) => {
  return useQuery<GetRecommendedUniversitiesResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getRecommendedUniversities, params],
    queryFn: () => getRecommendedUniversities({ params }),
  });
};

export default useGetRecommendedUniversities;
import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { RecommendedUniversitiesResponse, universitiesApi } from "./api";

import { ListUniversity } from "@/types/university";

import { useQuery } from "@tanstack/react-query";

type UseGetRecommendedUniversitiesParams = {
  isLogin: boolean;
};

/**
 * @description 추천 대학 목록 조회를 위한 useQuery 커스텀 훅
 * @param params.isLogin - 로그인 여부 (인스턴스 결정에 사용)
 */
const useGetRecommendedUniversities = ({ isLogin }: UseGetRecommendedUniversitiesParams) => {
  return useQuery<RecommendedUniversitiesResponse, AxiosError, ListUniversity[]>({
    queryKey: [QueryKeys.universities.recommendedUniversities, isLogin],
    queryFn: () => universitiesApi.getRecommendedUniversities({ isLogin }),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.recommendedUniversities as unknown as ListUniversity[],
  });
};

export default useGetRecommendedUniversities;

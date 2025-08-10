import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import { queryKey } from "./quertKey";

import { ListUniversity } from "@/types/university";

import { useQuery } from "@tanstack/react-query";

export type GetRecommendedUniversityResponse = { recommendedUniversities: ListUniversity[] };

const getRecommendedUniversity = async ({
  queryKey,
}: {
  queryKey: [string, boolean];
}): Promise<GetRecommendedUniversityResponse> => {
  const endpoint = "/univ-apply-infos/recommend";

  const [, isLogin] = queryKey;
  const instance = isLogin ? axiosInstance : publicAxiosInstance;
  const res = await instance.get<GetRecommendedUniversityResponse>(endpoint);
  return res.data;
};

const useGetRecommendedUniversity = (isLogin: boolean) =>
  useQuery({
    queryKey: [queryKey.recommendedUniversity, isLogin],
    queryFn: getRecommendedUniversity,
    enabled: isLogin, // 쿼리는 로그인 상태일 때만 활성화
    staleTime: 1000 * 60 * 5,
  });

export default useGetRecommendedUniversity;

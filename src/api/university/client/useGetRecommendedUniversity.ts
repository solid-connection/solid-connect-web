import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import { RecommendedUniversityResponse } from "../type/response";

import { useQuery } from "@tanstack/react-query";

const getRecommendedUniversity = async ({
  queryKey,
}: {
  queryKey: [string, boolean];
}): Promise<RecommendedUniversityResponse> => {
  const endpoint = "/universities/recommend";

  const [, isLogin] = queryKey;
  const instance = isLogin ? axiosInstance : publicAxiosInstance;
  const res = await instance.get(endpoint);
  return res.data;
};

const useGetRecommendedUniversity = (isLogin: boolean) =>
  useQuery({
    queryKey: ["recommended-university", isLogin],
    queryFn: getRecommendedUniversity,
    enabled: isLogin, // 쿼리는 로그인 상태일 때만 활성화
    staleTime: 1000 * 60 * 5,
  });

export default useGetRecommendedUniversity;
